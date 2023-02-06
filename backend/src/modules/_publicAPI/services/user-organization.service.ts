import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from 'src/modules/organization/services';
import { USER_ERRORS } from 'src/modules/user/constants/user-error.constants';
import { UserService } from 'src/modules/user/services/user.service';
import { UserWithOrganizationExceptionMessages } from '../exceptions/exceptions';
import { IUserWithOrganization } from '../interfaces/user-with-organization.interface';

@Injectable()
export class UserOrganizationService {
  private readonly logger = new Logger(UserOrganizationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
  ) {}

  // get user and organization data for teo initial user setup
  public async getUserWithOrganization(
    cognitoUserId: string,
  ): Promise<IUserWithOrganization> {
    try {
      // get user by cognito id
      const user = await this.userService.findOne({
        where: { cognitoId: cognitoUserId },
      });

      // throw use not found exception if not use is found by that criteria
      if (!user) {
        throw new NotFoundException(USER_ERRORS.GET);
      }

      // check if there is an organization id - this methods also handles organization not found
      const { organizationGeneral } =
        await this.organizationService.findWithRelations(user.organizationId);

      // build response
      return {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        organization: {
          name: organizationGeneral.name,
          email: organizationGeneral.email,
          phone: organizationGeneral.phone,
          address: 'address placeholder', // TODO: once we have the address to the organization, change this
          logo: organizationGeneral.logo,
          description: organizationGeneral.shortDescription,
        },
      };
    } catch (error) {
      // check if the exception has already been handled elsewhere
      if (error instanceof HttpException) {
        // throw exception
        throw error;
      } else {
        // build exception object
        const exception = {
          error,
          ...UserWithOrganizationExceptionMessages.USR_ONG_001,
        };

        // log exception
        this.logger.error(exception);

        // throw exception
        throw new BadRequestException(exception);
      }
    }
  }
}
