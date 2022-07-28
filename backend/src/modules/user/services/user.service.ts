import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { USER_FILTERS_CONFIG } from '../constants/user-filters.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { ActivateUserDto } from '../dto/restore-user.dto';
import { RestrictUserDto } from '../dto/restrict-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterDto } from '../dto/user-filter.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { UserRepository } from '../repositories/user.repository';
import { CognitoUserService } from './cognito.service';
import { USER_ERRORS } from '../constants/user-error.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cognitoService: CognitoUserService,
    private readonly pinoLogger: PinoLogger,
  ) {}

  /*
      Rules:
        1. Employee must be linked with an organization
  */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // TODO 1. Validate DTO
      // TODO 1.1. Check the organizationId exists
      // ====================================
      // 2. Create user in Cognito
      const cognitoId = await this.cognitoService.createUser(createUserDto);
      // 3. Create user in database
      const user = await this.userRepository.save({
        ...createUserDto,
        cognitoId,
        role: Role.EMPLOYEE,
      });
      return user;
    } catch (error) {
      this.pinoLogger.error({
        error: { error },
        ...USER_ERRORS.CREATE,
      });
      throw new InternalServerErrorException({
        ...USER_ERRORS.CREATE,
        error,
      });
    }
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | any> {
    return 'Update the UserDTO with the possible updates or create multiple DTOs.';
    // return this.userRepository.update({ id }, updateUserDto);
  }

  public async findAll(options: UserFilterDto): Promise<Pagination<User>> {
    return this.userRepository.getManyPaginated(USER_FILTERS_CONFIG, options);
  }

  findByCognitoId(cognitoId: string) {
    return this.userRepository.get({
      where: { cognitoId },
      relations: ['organization'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async restrictAccess(cognitoIds: RestrictUserDto[]) {
    const updated = [],
      failed = [];
    for (let i = 0; i < cognitoIds.length; i++) {
      const id = cognitoIds[i].cognitoId;
      try {
        await this.userRepository.update(
          { cognitoId: id },
          { status: UserStatus.RESTRICTED },
        );
        await this.cognitoService.globalSignOut(id);
        updated.push(id);
      } catch (error) {
        this.pinoLogger.error({
          error: { error },
          ...USER_ERRORS.RESTRICT,
          cognitoId: id,
        });
        failed.push({ cognitoId: id, error });
      }
    }
    return { updated, failed };
  }

  async restoreAccess(cognitoIds: ActivateUserDto[]) {
    const updated = [],
      failed = [];
    for (let i = 0; i < cognitoIds.length; i++) {
      const id = cognitoIds[i].cognitoId;
      try {
        await this.userRepository.update(
          { cognitoId: id },
          { status: UserStatus.ACTIVE },
        );
        updated.push(id);
      } catch (error) {
        this.pinoLogger.error({
          error: { error },
          ...USER_ERRORS.RESTORE,
          cognitoId: id,
        });
        failed.push({ cognitoId: id, error });
      }
    }
    return { updated, failed };
  }
}
