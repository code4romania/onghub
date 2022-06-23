import { Controller, Post } from '@nestjs/common';
import { EmailService } from './services/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  send() {
    return this.emailService.sendEmail();
  }
}
