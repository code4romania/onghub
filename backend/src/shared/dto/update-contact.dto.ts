import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiPropertyOptional()
  @IsNumber()
  id: number;
}
