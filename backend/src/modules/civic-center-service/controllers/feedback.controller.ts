import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../entities/feedback.entity';
import { FeedbackService } from '../services/feedback.service';

@ApiTooManyRequestsResponse()
@ApiBearerAuth()
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Public()
  @ApiBody({ type: CreateFeedbackDto })
  @Post()
  async create(@Body() body: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(body);
  }

  @Get()
  async findAll(@ExtractUser() user: User): Promise<Feedback[]> {
    return this.feedbackService.findAll(user);
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
