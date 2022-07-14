import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

export class UpdateInvestorDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfInvestors: number;

  @IsEnum(CompletionStatus)
  @IsOptional()
  status?: CompletionStatus;
}
