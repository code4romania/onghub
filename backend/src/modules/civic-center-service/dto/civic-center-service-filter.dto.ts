import { IsNumber, IsOptional } from 'class-validator';

export class CivicCenterServiceFilterDto {
  @IsNumber()
  @IsOptional()
  organizationId?: number;
}
