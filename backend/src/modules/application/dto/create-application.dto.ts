import {
  IsString,
  IsNotEmpty,
  Matches,
  Length,
  IsArray,
  IsEnum,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.NAME)
  @Length(3, 100)
  name: string;

  @IsEnum(ApplicationTypeEnum)
  @IsNotEmpty()
  type: ApplicationTypeEnum;

  @IsString()
  @Length(200, 250)
  shortDescription: string;

  @IsString()
  @Length(200, 250)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  video: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  loginLink: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsArray()
  @IsNotEmpty()
  @Length(10, 100, { each: true })
  steps: string[];
}
