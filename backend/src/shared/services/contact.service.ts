import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'src/shared/entities';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  get(conditions: FindOneOptions<Contact>) {
    return this.contactRepository.findOne(conditions);
  }
}
