import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateOrganizationActivityDto } from './create-organization-activity.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';
export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization General',
    type: () => CreateOrganizationGeneralDto,
  })
  @Type(() => CreateOrganizationGeneralDto)
  @ValidateNested()
  general: CreateOrganizationGeneralDto;

  @ApiProperty({
    description: 'Organization Activity',
    type: () => CreateOrganizationActivityDto,
  })
  @Type(() => CreateOrganizationActivityDto)
  @ValidateNested()
  activity: CreateOrganizationActivityDto;
}
