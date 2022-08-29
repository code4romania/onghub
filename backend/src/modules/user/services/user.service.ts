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
import { FindOneOptions, UpdateResult } from 'typeorm';
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

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cognitoService: CognitoUserService,
    private readonly organizationService: OrganizationService,
  ) {}

  // ****************************************************
  // ***************** PUBLIC METHODS ******************
  // ****************************************************

  public async createAdmin(createUserDto: CreateUserDto) {
    return this.create({
      ...createUserDto,
      status: UserStatus.PENDING,
      role: Role.ADMIN,
    });
  }

  public async createEmployee(createUserDto: CreateUserDto) {
    return this.create({
      ...createUserDto,
      role: Role.EMPLOYEE,
    });
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

  public async findOne(options: FindOneOptions): Promise<User> {
    return this.userRepository.get(options);
  }

  public async updateById(
    id: number,
    payload: UpdateUserDto,
    organizationId?: number,
  ): Promise<User> {
    try {
      // 1. Chekc if the user exists
      const user = await this.getById(id, organizationId);

      // 2. Update cognito user data
      await this.cognitoService.updateUser(user.email, payload);

      // 3. Update db user data
      return this.update(id, payload);
    } catch (error) {
      this.logger.error({
        error: { error },
        ...USER_ERRORS.UPDATE,
        id,
      });
      const err = error?.response;
      switch (err?.errorCode) {
        // 1. USR_007: User not found or doesn't have an organizationId
        case USER_ERRORS.GET.errorCode: {
          throw new BadRequestException({
            ...USER_ERRORS.GET,
            error: err,
          });
        }
        // 3. USR_009: Something unexpected happened while updating the user
        default: {
          throw new InternalServerErrorException({
            ...USER_ERRORS.UPDATE,
            error: err,
          });
        }
      }
    }
  }

  public async findAll(
    options: UserFilterDto,
    organizationId?: number,
  ): Promise<Pagination<User>> {
    const paginationOptions: any = {
      role: Role.EMPLOYEE,
      status: [UserStatus.ACTIVE, UserStatus.RESTRICTED],
      ...options,
    };

    // For Admin user we will sort by organizatioinId
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

  async remove(user: User): Promise<string> {
    // Prevent SuperAdmin deletion
    if (user.role === Role.SUPER_ADMIN) {
      throw new InternalServerErrorException(USER_ERRORS.REMOVE_SUPERADMIN);
    }

    try {
      await this.userRepository.delete({ cognitoId: user.cognitoId });
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

  async activateAdmin(user: User): Promise<User> {
    try {
      const { name, email, phone } = user;

      // 1. create user in cognito and send invite
      const cognitoId = await this.cognitoService.createUser({
        name,
        email,
        phone,
      });

      // 2. Update the user with the correct status and cognito id
      const userWithCognitoId = await this.userRepository.updateOne({
        ...user,
        status: UserStatus.ACTIVE,
        cognitoId,
      });
      return userWithCognitoId;
    } catch (error: any) {
      throw new InternalServerErrorException({
        ...USER_ERRORS.CREATE,
        error,
      });
    }
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
      // 1. Check if user already exists
      if (
        await this.userRepository.get({ where: { email: createUserDto.email } })
      ) {
        throw new BadRequestException(USER_ERRORS.CREATE_ALREADY_EXISTS);
      }
      // 2. Check the organizationId exists
      await this.organizationService.findWithRelations(
        createUserDto.organizationId,
      );

      let cognitoId = null;
      // User should be pending for new organization not sending the invite imediately
      if (createUserDto.status !== UserStatus.PENDING) {
        // 3. Create user in Cognito
        cognitoId = await this.cognitoService.createUser(createUserDto);
      }

      // 4. Create user in database
      const user = await this.userRepository.save({
        ...createUserDto,
        status: UserStatus.ACTIVE,
        cognitoId,
      });
      return user;
    } catch (error: HttpException | any) {
      this.logger.error({ error: { error }, ...USER_ERRORS.CREATE });
      const err = error?.response;
      switch (err?.errorCode) {
        // 1. USR_002: The organization does not exist
        case ORGANIZATION_ERRORS.GET.errorCode: {
          throw new BadRequestException({
            ...USER_ERRORS.CREATE_WRONG_ORG,
            error: err,
          });
        }
        // 2. USR_008: There is already a user with the same email address
        case USER_ERRORS.CREATE_ALREADY_EXISTS.errorCode: {
          throw error;
        }
        // 3. USR_001: Something unexpected happened
        default: {
          throw new InternalServerErrorException({
            ...USER_ERRORS.CREATE,
            error: err,
          });
        }
      }
    }
  }
}
