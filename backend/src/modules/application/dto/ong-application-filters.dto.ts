import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class OngApplicationFilterDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsBoolean()
  showAllApps?: boolean;
}
