import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { NomenclaturesService } from '../services';

@UseInterceptors(CacheInterceptor)
@Controller('nomenclatures')
export class NomenclaturesController {
  constructor(private nomenclaturesService: NomenclaturesService) {}

  @Get('cities')
  getCities() {
    return this.nomenclaturesService.getCities({});
  }
}
