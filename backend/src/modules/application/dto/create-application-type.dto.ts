import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'typeorm';
import { ApplicationTypes } from '../enums/application-type.enum';

export class CreateApplicationTypeDto {
  @IsEnum(ApplicationTypes)
  @IsNotEmpty()
  name: ApplicationTypes;
}
