import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { CreateEmailDto } from '../dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(@InjectQueue(QUEUES.MAILS) private emailQueue: Queue) {}

  async sendEmail(email: CreateEmailDto) {
    this.emailQueue.add(email);
  }
}
