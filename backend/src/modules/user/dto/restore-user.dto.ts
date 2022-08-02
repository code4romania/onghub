import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateUserDto {
  @IsString()
  @IsNotEmpty()
  cognitoId: string;
}
