import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateOrganizationGeneralDto } from './update-organization-general.dto';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Organization General',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationGeneralDto)
  @ValidateNested()
  general: UpdateOrganizationGeneralDto;
}
