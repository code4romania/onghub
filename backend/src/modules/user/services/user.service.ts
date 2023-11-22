import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ORGANIZATION_ERRORS } from 'src/modules/organization/constants/errors.constants';
import { OrganizationService } from 'src/modules/organization/services';
import {
  ArrayContains,
  ArrayOverlap,
  FindManyOptions,
  FindOneOptions,
  Not,
  UpdateResult,
} from 'typeorm';
import { USER_FILTERS_CONFIG } from '../constants/user-filters.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterDto } from '../dto/user-filter.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { UserRepository } from '../repositories/user.repository';
import { CognitoUserService } from './cognito.service';
import { USER_ERRORS } from '../constants/user-error.constants';
import { Pagination } from 'src/common/interfaces/pagination';
import { UserOngApplicationService } from 'src/modules/application/services/user-ong-application.service';
import {
  Access,
  ApplicationAccess,
} from 'src/modules/application/interfaces/application-access.interface';
import { INVITE_FILTERS_CONFIG } from '../constants/invites-filters.config';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { format } from 'date-fns';
import { DownloadFiltersDto } from '../dto/download-users.filter';
import { UserApplicationsViewRepository } from '../repositories/user-applications-view.repository';
import { UserApplicationsView } from '../entities/user-applications-view.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userApplicationsView: UserApplicationsViewRepository,
    private readonly cognitoService: CognitoUserService,
    private readonly organizationService: OrganizationService,
    private readonly userOngApplicationService: UserOngApplicationService,
  ) {}

  // ****************************************************
  // ***************** PUBLIC METHODS ******************
  // ****************************************************

  public async createAdmin(createUserDto: CreateUserDto) {
    return this.create({
      ...createUserDto,
      role: Role.ADMIN,
    });
  }

  public async createEmployee(createUserDto: CreateUserDto) {
    const { applicationAccess, ...userData } = createUserDto;

    // 1. create user and send invite
    const user = await this.create({
      ...userData,
      role: Role.EMPLOYEE,
    });

    if (applicationAccess?.length === 0) {
      return user;
    }

    await this.assignApplications(
      applicationAccess,
      user.id,
      userData.organizationId,
    );

    return user;
  }

  public async getById(
    id: number = null,
    organizationId?: number,
  ): Promise<User> {
    if (!id) {
      throw new NotFoundException({ ...USER_ERRORS.GET, id });
    }

    // 1. Get the user by id
    const user = await this.userRepository.get({ where: { id: id } });

    // 2. if there is not user with that id or if the user is not part as the same organization with the admin
    if (!user || (organizationId && user.organizationId !== organizationId)) {
      throw new NotFoundException({ ...USER_ERRORS.GET, id });
    }

    return user;
  }

  public async findOne(options: FindOneOptions<User>): Promise<User> {
    return this.userRepository.get(options);
  }

  public async findMany(options: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.getMany(options);
  }

  public async countUsers(options?: FindManyOptions<User>): Promise<number> {
    return this.userRepository.count(options);
  }

  public async updateById(
    id: number,
    payload: UpdateUserDto,
    organizationId?: number,
  ): Promise<User> {
    try {
      const { applicationAccess, ...userData } = payload;

      // 1. Check if user with received data exists
      const phoneCheck = await this.findOne({
        where: { phone: userData?.phone, id: Not(id) },
      });

      if (phoneCheck) {
        throw new BadRequestException(USER_ERRORS.ALREADY_EXISTS_PHONE);
      }

      // 2. Check if the user exists
      const user = await this.getById(id, organizationId);

      // 3. Update cognito user data
      await this.cognitoService.updateUser(user.email, {
        phone: user.phone,
        name: user.name,
        ...userData,
      });

      // 3. Remove current user applications
      await this.userOngApplicationService.remove({ where: { userId: id } });

      if (applicationAccess?.length > 0) {
        // 5. assign applications
        await this.assignApplications(
          applicationAccess,
          user.id,
          user.organizationId,
        );
      }

      // 6. Update db user data
      return this.update(id, userData);
    } catch (error) {
      this.logger.error({
        error: { error },
        ...USER_ERRORS.UPDATE,
        id,
      });
      const err = error?.response;
      switch (err?.errorCode) {
        // 1. USR_007: User not found or doesn't have an organizationId
        case USER_ERRORS.GET.errorCode:
        // 2. USR_011: Error whil granting access to application
        case USER_ERRORS.ACCESS.errorCode:
        // 3. USR_013: User already exists with this phone
        case USER_ERRORS.ALREADY_EXISTS_PHONE.errorCode:
          throw new BadRequestException(err);
        // 4. USR_009: Something unexpected happened while updating the user
        default: {
          throw new InternalServerErrorException({
            ...USER_ERRORS.UPDATE,
          });
        }
      }
    }
  }

  public async findAllWithApplications(
    options: UserFilterDto,
    organizationId?: number,
  ): Promise<Pagination<UserApplicationsView>> {
    const paginationOptions: any = {
      ...options,
      availableAppsIDs:
        options.availableAppsIDs?.length > 0
          ? ArrayContains(options.availableAppsIDs)
          : null,
    };

    // For Admin user we will sort by organizationId
    return this.userApplicationsView.getManyPaginated(
      USER_FILTERS_CONFIG,
      organizationId
        ? { ...paginationOptions, organizationId }
        : paginationOptions,
    );
  }

  public async findAll(
    options: UserFilterDto,
    organizationId?: number,
  ): Promise<Pagination<User>> {
    const paginationOptions: any = {
      role: Role.EMPLOYEE,
      status: `$in:${UserStatus.ACTIVE},${UserStatus.RESTRICTED}`,
      ...options,
    };

    // For Admin user we will sort by organizationId
    return this.userRepository.getManyPaginated(
      USER_FILTERS_CONFIG,
      organizationId
        ? { ...paginationOptions, organizationId }
        : paginationOptions,
    );
  }

  findByCognitoId(cognitoId: string) {
    return this.userRepository.get({
      where: { cognitoId },
      relations: ['organization'],
    });
  }

  async getInvitedUsers(
    options: Partial<BaseFilterDto>,
    organizationId: number,
  ): Promise<User[]> {
    const paginationOptions: any = {
      ...options,
      limit: 0,
      page: 0,
      organizationId,
      status: UserStatus.PENDING,
    };

    const invitees = await this.userRepository.getManyPaginated(
      INVITE_FILTERS_CONFIG,
      paginationOptions,
    );

    return invitees.items;
  }

  async remove(user: User): Promise<string> {
    // Prevent SuperAdmin deletion
    if (user.role === Role.SUPER_ADMIN) {
      throw new InternalServerErrorException(USER_ERRORS.REMOVE_SUPERADMIN);
    }

    try {
      // 1. Remove all associated apps with the user
      this.userOngApplicationService.remove({
        where: { userId: user.id },
      });
      // 2. Remove the user from the DB
      await this.userRepository.remove({
        where: { cognitoId: user.cognitoId },
      });
      // 3. Delete the user from Cognito
      await this.cognitoService.deleteUser(user.cognitoId);
      return user.cognitoId;
    } catch (error) {
      this.logger.error({
        error: { error },
        ...USER_ERRORS.REMOVE,
        cognitoId: user.cognitoId,
      });
      throw new InternalServerErrorException({
        ...USER_ERRORS.REMOVE,
        error,
      });
    }
  }

  async removeById(id: number, organizatioinId?: number): Promise<string> {
    // 1. Get the user by id
    const user = await this.getById(id, organizatioinId);

    return this.remove(user);
  }

  async restrictAccess(ids: number[], organizatioinId?: number) {
    const updated = [],
      failed = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      try {
        const user = await this.getById(id, organizatioinId);
        await this.userRepository.update(
          { id },
          { status: UserStatus.RESTRICTED },
        );
        await this.cognitoService.globalSignOut(user.cognitoId);
        updated.push(id);
      } catch (error) {
        this.logger.error({
          error: { error },
          ...USER_ERRORS.RESTRICT,
          id,
        });
        failed.push({ id, error });
      }
    }
    return { updated, failed };
  }

  async restoreAccess(ids: number[], organizationId?: number) {
    const updated = [],
      failed = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      try {
        const user = await this.getById(id, organizationId);
        await this.userRepository.update({ id }, { status: UserStatus.ACTIVE });
        updated.push(id);
      } catch (error) {
        this.logger.error({
          error: { error },
          ...USER_ERRORS.RESTORE,
          id,
        });
        failed.push({ id, error });
      }
    }
    return { updated, failed };
  }

  async resendUserInvite(userId: number): Promise<void> {
    const user = await this.getById(userId);
    await this.cognitoService.resendInvite(user.email);

    return;
  }

  public async getUsersForDownload(
    options: DownloadFiltersDto,
    organizationId: number,
  ): Promise<any> {
    const paginationOptions: any = {
      ...options,
      availableAppsIDs:
        options.availableAppsIDs?.length > 0
          ? ArrayContains(options.availableAppsIDs)
          : null,
    };

    // For Admin user we will sort by organizationId
    const users = await this.userApplicationsView.getManyPaginated(
      USER_FILTERS_CONFIG,
      organizationId
        ? { ...paginationOptions, organizationId }
        : paginationOptions,
    );

    const userData = users.items.map((user) => {
      return {
        Nume: user.name,
        Email: user.email,
        Telefon: user.phone,
        Status: user.status,
        'Access aplicatii': user.availableApps.map((i) => i.name).join(', '),
        'Data adaugarii': format(user.createdOn, 'yyyy-MM-dd'),
      };
    });

    return userData;
  }

  // ****************************************************
  // ***************** PRIVATE METHODS ******************
  // ****************************************************
  private async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | any> {
    return this.userRepository.update({ id }, updateUserDto);
  }

  private async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 1. Check if user already exists with received data
      if (
        await this.userRepository.get({ where: { email: createUserDto.email } })
      ) {
        throw new BadRequestException(USER_ERRORS.ALREADY_EXISTS_EMAIL);
      } else if (
        await this.userRepository.get({ where: { phone: createUserDto.phone } })
      ) {
        throw new BadRequestException(USER_ERRORS.ALREADY_EXISTS_PHONE);
      }
      // 2. Check the organizationId exists
      await this.organizationService.findWithRelations(
        createUserDto.organizationId,
      );
      // 3. Create user in Cognito
      const cognitoId = await this.createCognitoUser(createUserDto);
      // 4. Create user in database
      const user = await this.userRepository.save({
        ...createUserDto,
        cognitoId,
      });
      return user;
    } catch (error: HttpException | any) {
      this.logger.error({ error: { error }, ...USER_ERRORS.CREATE });
      const err = error?.response;
      switch (err?.errorCode) {
        // 1. USR_002: The organization does not exist
        case ORGANIZATION_ERRORS.GET.errorCode:
        // 2. USR_011: Error on assigning applications
        case USER_ERRORS.ACCESS.errorCode:
        // 3. USR_008: User already exists with this email
        case USER_ERRORS.ALREADY_EXISTS_EMAIL.errorCode:
        // 4. USR_013: User already exists with this phone
        case USER_ERRORS.ALREADY_EXISTS_PHONE.errorCode:
        // 5. USR_015: Cognito could not deliver the confirmation code. Email is invalid
        case USER_ERRORS.INVALID_EMAIL_COGNITO_CODE_DELIVERY.errorCode:
          throw new BadRequestException(err);
        // 5. USR_001: Something unexpected happened
        default: {
          throw new InternalServerErrorException({
            ...USER_ERRORS.CREATE,
          });
        }
      }
    }
  }

  /**
   * Handle possible errors from Cognito while creating a user https://github.com/code4romania/onghub/issues/358
   * We encounter the problem where the user can insert an invalid email that passes our regex validation and Cognito's
   * Basically a user john.doe±test1@gmail.com goes as valid, but the Code could not be delivered. So we will handle this
   * **/
  private async createCognitoUser(
    createUserDto: CreateUserDto,
  ): Promise<string> {
    let cognitoId;
    try {
      cognitoId = await this.cognitoService.createUser(createUserDto);
    } catch (err) {
      switch (err?.name) {
        case 'UsernameExistsException':
          throw new BadRequestException(USER_ERRORS.ALREADY_EXISTS_EMAIL);
        case 'CodeDeliveryFailureException':
          throw new BadRequestException(
            USER_ERRORS.INVALID_EMAIL_COGNITO_CODE_DELIVERY,
          );
        default:
          throw err;
      }
    }

    return cognitoId;
  }

  private async assignApplications(
    applicationAccess: Access[],
    userId: number,
    organizationId: number,
  ) {
    // 2. grant access to applications
    try {
      const valuesToInsert = applicationAccess.map(
        ({ ongApplicationId, status }) => ({
          ongApplicationId,
          organizationId,
          userId,
          status,
        }),
      );

      await this.userOngApplicationService.createMany(valuesToInsert);
    } catch (error) {
      this.logger.error({
        error: { error },
        ...USER_ERRORS.ACCESS,
      });
      throw new BadRequestException({
        ...USER_ERRORS.ACCESS,
      });
    }
  }
}
