import { PartialType, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(
  OmitType(CreateApplicationDto, ['type']),
) {
  @IsOptional()
  cognitoClientId?: string;
}
