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
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { Skill } from 'src/shared/entities';

export class CreatePracticeProgramDto {
  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 50)
  title: string;

  @IsDate()
  @IsOptional()
  deadline?: Date;

  @IsString()
  @Length(3, 3000)
  description: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  @IsOptional()
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
