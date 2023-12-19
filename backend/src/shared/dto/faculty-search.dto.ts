import { IsOptional, IsString } from 'class-validator';

export class FacultySearchDto {
  @IsOptional()
  @IsString()
  search?: string;
}
