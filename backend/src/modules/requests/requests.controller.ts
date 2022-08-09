import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { RequestsService } from './services/requests.service';
import { Request } from '../requests/entities/request.entity';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Patch(':id/approve')
  approve(@Param('id') id: number): Promise<Request> {
    return this.requestsService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: number): Promise<Request> {
    return this.requestsService.reject(id);
  }
}
