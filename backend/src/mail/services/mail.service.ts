import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QUEUES.MAILS) private emailQueue: Queue<ISendMailOptions>,
    private configService: ConfigService,
  ) {}

  async sendEmail(email: ISendMailOptions) {
    const from = email?.from ? email.from : this.configService.get('MAIL_FROM');

    return this.emailQueue.add({
      from,
      ...email,
      context: {
        ...email.context,
        contactEmail: process.env.MAIL_CONTACT, // To make available the variable to all templates, especially the partials (header and footer)
      },
    });
  }
}
