import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { InjectQueue } from '@nestjs/bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { Queue } from 'bull';
import { ApiBody, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { CreateEmailDto } from './dto/create-email.dto';

@ApiTooManyRequestsResponse()
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @InjectQueue(QUEUES.MAILS) private readonly emailQueue: Queue,
  ) {}

  @ApiBody({ type: CreateEmailDto })
  @Post()
  async send(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.sendEmail(createEmailDto);
  }
}
