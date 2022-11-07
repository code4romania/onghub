import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../entities/feedback.entity';
import { FeedbackService } from '../services/feedback.service';

@ApiTooManyRequestsResponse()
@ApiBearerAuth()
@Controller('civic-center/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Public()
  @ApiBody({ type: CreateFeedbackDto })
  @Post()
  async create(@Body() body: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(body);
  }

  @ApiQuery({ type: () => BaseFilterDto })
  @Get()
  async findAll(
    @ExtractUser() user: User,
    @Query() options: BaseFilterDto,
  ): Promise<Pagination<Feedback>> {
    return this.feedbackService.findManyPaginated(user, options);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.feedbackService.remove(id);
  }
}
