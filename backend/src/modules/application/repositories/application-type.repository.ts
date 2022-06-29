import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { ApplicationType } from '../entities/application-type.entity';

@Injectable()
export class ApplicationTypeREpository extends BaseDAO<ApplicationType> {
  constructor(
    @InjectRepository(ApplicationType)
    private readonly applicationTypeRepository: Repository<ApplicationType>,
  ) {
    super(applicationTypeRepository);
  }
}
