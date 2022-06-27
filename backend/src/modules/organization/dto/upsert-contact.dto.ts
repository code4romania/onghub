import { PartialType } from '@nestjs/swagger';
import { UpdateContactDto } from './update-contact.dto';

export class UpsertContactDto extends PartialType(UpdateContactDto) {}
