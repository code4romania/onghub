import { ApiProperty } from '@nestjs/swagger';

export class Investor {
  @ApiProperty()
  name: string;

  @ApiProperty()
  years: number[];
}
