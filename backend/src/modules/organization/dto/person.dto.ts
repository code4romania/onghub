import { ApiProperty } from '@nestjs/swagger';

export class Person {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  role: string;
}
