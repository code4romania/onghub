import { PartialType, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(
  OmitType(CreateApplicationDto, ['type']),
) {
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}
