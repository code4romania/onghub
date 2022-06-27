import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Person } from 'src/modules/organization/dto/person.dto';
import { CreateContactDto } from 'src/modules/organization/dto/create-contact.dto';

export class CreateOrganizationLegalDto {
  @ApiProperty({
    description: 'Organization legal representative',
    type: () => CreateContactDto,
  })
  @Type(() => CreateContactDto)
  @ValidateNested()
  legalReprezentative: CreateContactDto;

  @ApiProperty({
    description: 'Organization directors',
    type: () => [CreateContactDto],
  })
  @Type(() => CreateContactDto)
  @ValidateNested()
  directors: CreateContactDto[];

  @ApiPropertyOptional({
    description: 'Other relevant persons in organization',
    type: [Person],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Person)
  others: Person[];

  @ApiPropertyOptional({
    description: 'Organization statute link',
  })
  @IsOptional()
  @IsString()
  organizationStatute?: string;
}
