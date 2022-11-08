import {
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  civicCenterServiceId: number;

  @IsString()
  @Length(3, 100)
  fullName: string;

  @IsString()
  @MaxLength(30)
  interactionDate: string;

  @IsString()
  @Length(50, 500)
  message: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
