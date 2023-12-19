import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Role } from 'src/modules/user/enums/role.enum';
import { ONG_APPLICATION_ERRORS } from '../constants/application-error.constants';
import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { UserOngApplicationStatus } from '../enums/user-ong-application-status.enum';
import { OngApplicationService } from '../services/ong-application.service';
import { UserOngApplicationService } from '../services/user-ong-application.service';

@Injectable()
export class CivicCenterServiceAccessGuard implements CanActivate {
  private readonly logger = new Logger(CivicCenterServiceAccessGuard.name);
  constructor(
    private readonly ongApplicationService: OngApplicationService,
    private readonly userOngApplicationService: UserOngApplicationService,
  ) {}

  /**
   * Using the @Roles decorator will check if the current user has access assigned and has access to the civic center service application
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get user data from request
    const { user } = context.switchToHttp().getRequest();

    // 2. If super-admin then skip validation
    if (user?.role === Role.SUPER_ADMIN) {
      return true;
    }

    // 3. For Admin and Employee we need to validate if he has the civic center service application
    try {
      // 3.1 Check if the organization has practice 4 good assigned to it
      const application =
        await this.ongApplicationService.findOngApplicationWithOptions({
          where: {
            organizationId: user?.organizationId,
            application: {
              status: ApplicationStatus.ACTIVE,
              pullingType: ApplicationPullingType.CIVIC_SERVICE,
            },
            status: OngApplicationStatus.ACTIVE,
          },
        });

      if (user?.role === Role.ADMIN) {
        return !!application;
      } else {
        // 3.2 validate employee - check if there is an active connection between the ong app and employee
        const userApplication = await this.userOngApplicationService.findOne({
          where: {
            ongApplicationId: application.id,
            status: UserOngApplicationStatus.ACTIVE,
            userId: user?.id,
          },
        });

        return !!userApplication;
      }
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ONG_APPLICATION_ERRORS.VALIDATE_ACCESS,
      });
    }

    // return forbidden if an error occurs or no scenario abbove is applied
    return false;
  }
}
