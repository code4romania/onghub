import { PartialType } from '@nestjs/swagger';
import { CreatePracticeProgramDto } from './create-practice-program.dto';

export class UpdatePracticeProgramDto extends PartialType(
  CreatePracticeProgramDto,
) {}
