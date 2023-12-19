import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

export class OrganizationApplicationFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ApplicationTypeEnum)
  type?: ApplicationTypeEnum;
}
