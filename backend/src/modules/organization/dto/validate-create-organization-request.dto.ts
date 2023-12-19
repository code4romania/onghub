import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateUserRequestDto } from './create-organization-request.dto';
import { UpdateOrganizationDto } from './update-organization.dto';

export class ValidateCreateOrganizationRequestDto {
  /* Request Admin */
  @IsOptional()
  @Type(() => CreateUserRequestDto)
  @ValidateNested()
  admin: CreateUserRequestDto;

  @IsOptional()
  @Type(() => UpdateOrganizationDto)
  @ValidateNested()
  organization: UpdateOrganizationDto;
}
