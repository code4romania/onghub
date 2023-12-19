import {
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @Length(3, 200)
  fullName: string;

  @IsString()
  @MaxLength(50)
  interactionDate: string;

  @IsString()
  @MaxLength(500)
  message: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
