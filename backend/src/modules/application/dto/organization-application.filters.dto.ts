import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';

export class OrganizationApplicationFilterDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
