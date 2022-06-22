import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(10)
  @ApiProperty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  email: string;
}
