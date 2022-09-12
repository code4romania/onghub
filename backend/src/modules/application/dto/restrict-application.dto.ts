import { IsNumber } from 'class-validator';

export class RestrictApplicationDto {
  @IsNumber()
  organizationId: number;
}
