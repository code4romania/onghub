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
import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
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

  @IsEnum(ApplicationPullingType)
  @IsOptional()
  pullingType: ApplicationPullingType;

  @IsString()
  @Length(50, 120)
  shortDescription: string;

  @IsString()
  @Length(2, 7000)
  description: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  videoLink: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.LINK)
  website: string;

  @IsString()
  @Matches(REGEX.LINK)
  loginLink: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsArray()
  @IsOptional()
  @Length(2, 100, { each: true })
  steps?: string[];
}
