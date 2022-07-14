import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

export class UpdateReportDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  report: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfVolunteers: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfContractors: number;

  @IsEnum(CompletionStatus)
  @IsOptional()
  status?: CompletionStatus;
}
