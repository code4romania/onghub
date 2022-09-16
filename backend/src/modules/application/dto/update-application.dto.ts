import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(
  OmitType(CreateApplicationDto, ['type']),
) {}
