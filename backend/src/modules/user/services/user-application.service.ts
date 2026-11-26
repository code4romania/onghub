import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import {
  APPLICATION_ERRORS,
  ONG_APPLICATION_ERRORS,
  USER_ONG_APPLICATION_ERRORS,
} from 'src/modules/application/constants/application-error.constants';
import { ApplicationStatus } from 'src/modules/application/enums/application-status.enum';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';
import { UserOngApplicationStatus } from 'src/modules/application/enums/user-ong-application-status.enum';
import { ApplicationService } from 'src/modules/application/services/application.service';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { UserOngApplicationService } from 'src/modules/application/services/user-ong-application.service';
import { ORGANIZATION_ERRORS } from 'src/modules/organization/constants/errors.constants';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { OrganizationService } from 'src/modules/organization/services';
import { USER_ERRORS } from '../constants/user-error.constants';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { UserService } from './user.service';

@Injectable()
export class UserApplicationService {
  private readonly logger = new Logger(UserApplicationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
    private readonly userOngApplicationService: UserOngApplicationService,
  ) {}
}
