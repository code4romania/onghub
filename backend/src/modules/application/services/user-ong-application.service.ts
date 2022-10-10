import { Injectable, Logger } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { UserOngApplication } from '../entities/user-ong-application.entity';
import { UserOngApplicationRepository } from '../repositories/user-ong-application.repository';

@Injectable()
export class UserOngApplicationService {
  private readonly logger = new Logger(UserOngApplicationService.name);
  constructor(
    private readonly userOngApplicationRepository: UserOngApplicationRepository,
  ) {}

  public async findOne(
    conditions: FindOneOptions<UserOngApplication>,
  ): Promise<UserOngApplication> {
    return this.userOngApplicationRepository.get(conditions);
  }

  public async createMany(
    entities: DeepPartial<UserOngApplication>[],
  ): Promise<UserOngApplication[]> {
    return this.userOngApplicationRepository.saveMany(entities);
  }

  public async remove(
    options: FindOptionsWhere<UserOngApplication>,
  ): Promise<UserOngApplication> {
    return this.userOngApplicationRepository.remove(options);
  }
}
