import { Injectable } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { USER_FILTERS_CONFIG } from '../constants/user-filters.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterDto } from '../dto/user-filter.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Create new employee
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save({
      ...createUserDto,
      role: Role.EMPLOYEE,
    });

    //TODO: send user invite

    return user;
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userRepository.update({ id }, updateUserDto);
  }

  public async findAll(options: UserFilterDto): Promise<Pagination<User>> {
    return this.userRepository.getManyPaginated(USER_FILTERS_CONFIG, options);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
