import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QUEUES.MAILS) private emailQueue: Queue<ISendMailOptions>,
  ) {}

  async sendEmail(email: ISendMailOptions) {
    return this.emailQueue.add(email);
  }
}
