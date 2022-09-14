import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { UserOngApplication } from '../entities/user-ong-application.entity';

@Injectable()
export class UserOngApplicationRepository extends BaseDAO<UserOngApplication> {
  constructor(
    @InjectRepository(UserOngApplication)
    private readonly userOngApplicationRepository: Repository<UserOngApplication>,
  ) {
    super(userOngApplicationRepository);
  }
}
