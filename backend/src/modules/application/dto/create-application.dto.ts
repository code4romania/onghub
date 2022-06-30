import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsString,
  IsNotEmpty,
  Matches,
  Length,
  IsArray,
} from 'class-validator';
import { CreateApplicationTypeDto } from './create-application-type.dto';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.NAME)
  @Length(3, 100)
  name: string;

  @Type(() => CreateApplicationTypeDto)
  @ValidateNested()
  type: CreateApplicationTypeDto;

  @IsArray()
  @IsNotEmpty()
  @Length(10, 100, { each: true })
  @Matches(REGEX.DESCRIPTION, { each: true })
  steps: string[];

  @IsString()
  @IsNotEmpty()
  @Length(200, 250)
  @Matches(REGEX.DESCRIPTION)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(200, 250)
  @Matches(REGEX.DESCRIPTION)
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
