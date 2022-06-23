import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendEmail(): void {
    this.mailerService
      .sendMail({
        to: process.env.MAIL_TO,
        from: process.env.MAIL_FROM,
        subject: 'Testing Nest MailerModule',
        text: 'welcome',
        html: '<b>welcome</b>',
      })
      .then(() => {})
      .catch(() => {});
  }
}
