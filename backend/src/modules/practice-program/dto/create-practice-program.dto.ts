import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
import { Skill } from 'src/shared/entities';

const MIN_DATE = new Date();
MIN_DATE.setHours(0, 0, 0, 0);

export class CreatePracticeProgramDto {
  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 50)
  title: string;

  @IsDate()
  @IsOptional()
  @MinDate(MIN_DATE)
  deadline?: Date;

  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 3000)
  description: string;

  @IsDate()
  @MinDate(MIN_DATE)
  startDate: Date;

  @IsDate()
  @IsOptional()
  @MinDate(MIN_DATE)
  endDate?: Date;

  @IsBoolean()
  isPeriodNotDetermined: boolean;

  @IsNumber()
  @Min(0)
  minWorkingHours: number;

  @IsNumber()
  @Min(0)
  maxWorkingHours: number;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  link: string;

  @IsNumber()
  locationId: number;

  @IsArray()
  @ArrayNotEmpty()
  domains: number[];

  @IsArray()
  @IsOptional()
  faculties?: number[];

  @IsArray()
  @IsOptional()
  skills?: Partial<Skill>[];

  @IsNumber()
  @IsOptional()
  organizationId?: number;
}
