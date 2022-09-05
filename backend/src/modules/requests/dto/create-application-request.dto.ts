import { IsNumber, IsOptional } from 'class-validator';

export class CreateApplicationRequestDto {
  @IsNumber()
  @IsOptional()
  organizationId?: number;

  @IsNumber()
  applicationId: number;
}
