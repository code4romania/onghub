import {
  IsString,
  IsNotEmpty,
  Matches,
  Length,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  name: string;

  @IsEnum(ApplicationTypeEnum)
  @IsNotEmpty()
  type: ApplicationTypeEnum;

  @IsString()
  @Length(50, 250)
  shortDescription: string;

  @IsString()
  @Length(200, 1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  videoLink: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  website: string;

  @IsOptional()
  @Matches(REGEX.LINK)
  loginLink: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsArray()
  @IsNotEmpty()
  @Length(2, 100, { each: true })
  steps: string[];
}
