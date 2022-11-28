import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import {
  APPLICATION_ERRORS,
  ONG_APPLICATION_ERRORS,
  USER_ONG_APPLICATION_ERRORS,
} from 'src/modules/application/constants/application-error.constants';
import { ApplicationStatus } from 'src/modules/application/enums/application-status.enum';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';
import { UserOngApplicationStatus } from 'src/modules/application/enums/user-ong-application-status.enum';
import { AppService } from 'src/modules/application/services/app.service';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { UserOngApplicationService } from 'src/modules/application/services/user-ong-application.service';
import { ORGANIZATION_ERRORS } from 'src/modules/organization/constants/errors.constants';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { OrganizationService } from 'src/modules/organization/services';
import { USER_ERRORS } from '../constants/user-error.constants';
import { User } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';
import { UserService } from './user.service';

@Injectable()
export class UserApplicationService {
  private readonly logger = new Logger(UserApplicationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly applicationService: AppService,
    private readonly ongApplicationService: OngApplicationService,
    private readonly userOngApplicationService: UserOngApplicationService,
  ) {}

  /**
   *
   * @param cognitoApplicationId
   * @param cognitoUserId
   * @returns TODO document errors
   */
  public async hasAccess(
    cognitoApplicationId: string,
    cognitoUserId: string,
  ): Promise<boolean> {
    // 1. Find the user who is requesting the access and check the status
    const user: User = await this.userService.findByCognitoId(cognitoUserId);

    // 1.1. Rare case where we don't have the user in evidence (only if was created somewhere else / in cognito directly maybe)
    if (!user) {
      throw new ForbiddenException(USER_ERRORS.GET);
    }

    // 1.2. The user is restricted, stop here
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(USER_ERRORS.RESTRICTED);
    }

    // 2. Find the organization of the user

    // 2.1. SuperAdmins have no organization, are not allowed to access apps
    if (!user.organizationId) {
      throw new ForbiddenException(USER_ERRORS.MISSING_ORGANIZATION);
    }

    const organization = await this.organizationService.find(
      user?.organizationId,
    );

    // 2.2. The organization is not ACTIVE, stop here
    if (organization.status !== OrganizationStatus.ACTIVE) {
      throw new ForbiddenException(ORGANIZATION_ERRORS.RESTRICTED);
    }

    // 3. Check if the application exists and it's ACTIVE
    const application = await this.applicationService.findOneByCognitoId(
      cognitoApplicationId,
    );

    // 3.1. The application requested does not exist
    if (!application) {
      throw new ForbiddenException(APPLICATION_ERRORS.GET);
    }

    // 3.2. The application is inactive
    if (application.status !== ApplicationStatus.ACTIVE) {
      throw new ForbiddenException(APPLICATION_ERRORS.INACTIVE);
    }

    // 4. Check if the NGO and the user has access to the application
    // 4.1. Find the relation between the NGO (of the requester) and the Application
    const ongApplication = await this.ongApplicationService.findOne(
      application.id,
      user.organizationId,
    );

    // 4.1.1. The relation exists but is not active (is restricted)
    if (ongApplication.status !== OngApplicationStatus.ACTIVE) {
      throw new ForbiddenException(ONG_APPLICATION_ERRORS.RELATION_RESTRICTED);
    }

    // 4.2. Find the relation between the USER and the Application (the relation of the NGO)
    const userOngApplication = await this.userOngApplicationService.findOne({
      where: {
        userId: user.id,
        ongApplicationId: ongApplication.id,
      },
    });

    // 4.2.1. The relation may not exist or is restricted, access denied
    if (
      !userOngApplication ||
      userOngApplication.status !== UserOngApplicationStatus.ACTIVE
    ) {
      throw new ForbiddenException(
        USER_ONG_APPLICATION_ERRORS.MISSING_PERMISSION,
      );
    }

    return true;
  }
}
