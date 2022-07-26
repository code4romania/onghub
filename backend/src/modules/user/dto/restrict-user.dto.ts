import { IsNotEmpty, IsString } from 'class-validator';

export class RestrictUserDto {
  @IsString()
  @IsNotEmpty()
  cognitoId: string;
}
