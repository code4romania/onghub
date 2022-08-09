import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';

@Injectable()
export class RequestRepository extends BaseDAO<Request> {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {
    super(requestRepository);
  }
}
