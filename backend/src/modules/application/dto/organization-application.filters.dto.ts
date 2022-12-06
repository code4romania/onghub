import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

export class OrganizationApplicationFilterDto {
  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ApplicationTypeEnum)
  type?: ApplicationTypeEnum;
}
