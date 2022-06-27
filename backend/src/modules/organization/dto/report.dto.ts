import { ApiProperty } from '@nestjs/swagger';

export class Report {
  @ApiProperty()
  link: string;

  @ApiProperty()
  year: number;
}
