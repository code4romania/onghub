import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

export class UpdatePartnerDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfPartners: number;
}
