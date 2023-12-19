import { IsNumber } from 'class-validator';

export class ApplicationAccessFilterDto {
  @IsNumber()
  organizationId: number;
}
