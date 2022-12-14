import { IsNumber, IsOptional } from 'class-validator';

export class GetCivicCenterServicesFilterDto {
  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
