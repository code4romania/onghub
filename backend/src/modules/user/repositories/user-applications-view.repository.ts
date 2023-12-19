import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { UserApplicationsView } from '../entities/user-applications-view.entity';

@Injectable()
export class UserApplicationsViewRepository extends BaseDAO<UserApplicationsView> {
  constructor(
    @InjectRepository(UserApplicationsView)
    private readonly userApplicationsViewRepository: Repository<UserApplicationsView>,
  ) {
    super(userApplicationsViewRepository);
  }
}
