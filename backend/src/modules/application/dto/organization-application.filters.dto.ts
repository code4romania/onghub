import { IsNumber, IsOptional } from 'class-validator';

export class OrganizationApplicationFilterDto {
  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
