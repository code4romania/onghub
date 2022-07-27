import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from 'src/modules/organization/constants/errors.constants';
import { OrganizationService } from 'src/modules/organization/services';
import { UpdateResult } from 'typeorm';
import { USER_FILTERS_CONFIG } from '../constants/user-filters.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterDto } from '../dto/user-filter.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserRepository } from '../repositories/user.repository';
import { CognitoUserService } from './cognito.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cognitoService: CognitoUserService,
    private readonly organizationService: OrganizationService,
  ) {}

  /*
      Rules:
        1. Employee must be linked with an organization
  */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // TODO 1. Validate DTO
      // 1.1. Check the organizationId exists
      const organization = await this.organizationService.findOne(
        createUserDto.organizationId,
      );
      if (!organization) {
        throw new NotFoundException({
          message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
          errorCode: ERROR_CODES.ORG001,
        });
      }
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
      throw new InternalServerErrorException(error);
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
}
