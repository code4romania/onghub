import { PartialType } from '@nestjs/swagger';
import { CreateCivicCenterServiceDto } from './create-civic-center-service.dto';

export class UpdateCivicCenterServiceDto extends PartialType(
  CreateCivicCenterServiceDto,
) {}
