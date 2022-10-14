import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  MinDate,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreatePracticeProgramDto {
  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 50)
  title: string;

  @IsDate()
  @IsOptional()
  @MinDate(new Date())
  deadline?: Date;

  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 3000)
  description: string;

  @IsDate()
  @MinDate(new Date())
  startDate: Date;

  @IsDate()
  @IsOptional()
  @MinDate(new Date())
  endDate?: Date;

  @IsNumber()
  @Min(0)
  minWorkingHours: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxWorkingHours?: number;

  @IsString()
  @Matches(REGEX.LINK)
  link: string;

  @IsNumber()
  locationId: number;

  @IsArray()
  @ArrayNotEmpty()
  domains: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  faculties?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  skills?: number[];
}
