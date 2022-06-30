import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateApplicationTypeDto } from '../dto/update-application-type.dto';
import { ApplicationType } from '../entities/application-type.entity';

@Injectable()
export class ApplicationTypeService {
  constructor(
    @InjectRepository(ApplicationType)
    private readonly applicationTypeRepository: Repository<ApplicationType>,
  ) {}

  public async update(
    id: number,
    updateApplicationTypeDto: UpdateApplicationTypeDto,
  ) {
    return this.applicationTypeRepository.save({
      id,
      ...updateApplicationTypeDto,
    });
  }

  public getTypes(conditions: FindOneOptions<ApplicationType>) {
    return this.applicationTypeRepository.find(conditions);
  }
}
