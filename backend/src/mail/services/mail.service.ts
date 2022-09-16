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
  ) {
    this.sendEmail({ to: 'hehe@yahoo.com' });
  }

  async sendEmail(email: ISendMailOptions) {
    return this.emailQueue.add({
      from: this.configService.get('NOTIFICATION_ADDRESS'),
      ...email,
    });
  }
}
