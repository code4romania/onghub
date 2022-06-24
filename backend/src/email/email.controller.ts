import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { EmailProcessor } from './services/email-processor.service';
import { EmailService } from './services/email.service';
import { InjectQueue } from '@nestjs/bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { Queue } from 'bull';
import { ApiBody } from '@nestjs/swagger';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailProcessor: EmailProcessor,
    @InjectQueue(QUEUES.MAILS) private readonly emailQueue: Queue,
  ) {}

  @ApiBody({ type: CreateEmailDto })
  @Post()
  async send(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.sendEmail(createEmailDto);
  }
}
