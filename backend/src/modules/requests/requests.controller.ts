import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Param,
  Body,
  Post,
  Query,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { RequestsService } from './services/requests.service';
import { Request } from '../requests/entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Pagination } from 'src/common/interfaces/pagination';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @ApiQuery({ type: () => BaseFilterDto })
  @Get('')
  async getAll(@Query() filters: BaseFilterDto): Promise<Pagination<Request>> {
    return this.requestsService.findAll(filters);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Request> {
    return this.requestsService.findOne(+id);
  }

  @Public()
  @ApiBody({ type: CreateRequestDto })
  @Post()
  create(@Body() createRequestDto: CreateRequestDto): Promise<Request> {
    return this.requestsService.create(createRequestDto);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: number): Promise<Request> {
    return this.requestsService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: number): Promise<Request> {
    return this.requestsService.reject(id);
  }
}
