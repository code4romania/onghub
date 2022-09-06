import { IsNumber } from 'class-validator';

export class CreateApplicationRequestDto {
  @IsNumber()
  applicationId: number;
}
