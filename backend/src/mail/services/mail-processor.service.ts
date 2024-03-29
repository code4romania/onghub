import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { Job } from 'bull';

@Processor(QUEUES.MAILS)
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  public async processor(job: Job<ISendMailOptions>) {
    const mailOptions = job.data;
    return this.mailerService.sendMail(mailOptions);
  }
}
