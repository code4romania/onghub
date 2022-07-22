import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Contact } from '../entities';
import { ContactRepository } from '../repositories';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  get(conditions: FindOneOptions<Contact>) {
    return this.contactRepository.get(conditions);
  }

  getMany(conditions: FindManyOptions<Contact>) {
    return this.contactRepository.getMany(conditions);
  }

  delete(findCriteria: FindOptionsWhere<Contact>) {
    return this.contactRepository.remove(findCriteria);
  }
}
