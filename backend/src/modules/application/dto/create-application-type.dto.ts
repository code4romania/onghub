import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreateApplicationTypeDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(REGEX.NAME)
  name: string;
}
