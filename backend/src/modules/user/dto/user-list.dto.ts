import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserListDto {
  @IsArray()
  @IsOptional()
  attributes?: string[];

  @IsString()
  @IsOptional()
  filter?: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  pagination?: string;
}
