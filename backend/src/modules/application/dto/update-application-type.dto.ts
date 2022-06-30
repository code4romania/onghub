import { PartialType } from '@nestjs/swagger';
import { CreateApplicationTypeDto } from './create-application-type.dto';

export class UpdateApplicationTypeDto extends PartialType(
  CreateApplicationTypeDto,
) {}
