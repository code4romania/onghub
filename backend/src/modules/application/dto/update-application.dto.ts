import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateApplicationDto } from './create-application.dto';
import { UpdateApplicationTypeDto } from './update-application-type.dto';

export class UpdateApplicationDto extends PartialType(
  OmitType(CreateApplicationDto, ['type']),
) {
  @IsOptional()
  @Type(() => UpdateApplicationTypeDto)
  @ValidateNested()
  type?: UpdateApplicationTypeDto;
}
