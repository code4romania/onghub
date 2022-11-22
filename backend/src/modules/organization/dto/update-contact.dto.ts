import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { ToNumber } from 'src/common/decorators/to-number.decorator';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsOptional()
  @ToNumber()
  @IsNumber()
  id?: number;
}
