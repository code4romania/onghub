import {
  IsString,
  IsNotEmpty,
  Matches,
  Length,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.NAME)
  @Length(3, 100)
  name: string;

  @IsNumber()
  typeId: number;

  @IsArray()
  @IsNotEmpty()
  @Length(10, 100, { each: true })
  steps: string[];

  @IsString()
  @IsNotEmpty()
  @Length(200, 250)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(200, 250)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  loginLink: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  video: string;

  @IsString()
  @IsNotEmpty()
  logo: string;
}
