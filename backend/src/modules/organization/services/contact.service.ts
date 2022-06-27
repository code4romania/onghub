import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Contact } from '../entities';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  get(conditions: FindOneOptions<Contact>) {
    return this.contactRepository.findOne(conditions);
  }

  getMany(conditions: FindManyOptions<Contact>) {
    return this.contactRepository.find(conditions);
  }
}
