import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsNumber()
  id?: number;
}
