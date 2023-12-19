import { IsNumber, IsOptional } from 'class-validator';

export class GetPracticeProgramFilterDto {
  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
