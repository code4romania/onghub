import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IPerson } from 'src/common/models/person.interface';
import { CreateContactDto } from 'src/shared/dto/create-contact.dto';

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
  })
  @IsOptional()
  @IsArray()
  others: IPerson[];

  @ApiPropertyOptional({
    description: 'Organization statute link',
  })
  @IsOptional()
  @IsString()
  organizationStatute?: string;
}
