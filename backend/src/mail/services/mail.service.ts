import { Injectable, Logger } from '@nestjs/common';
import { allowedRecipients, parseAllowlist } from '../mail-allowlist';
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

  private readonly logger = new Logger(MailService.name);

  async sendEmail(email: ISendMailOptions) {
    const from = email?.from ? email.from : this.configService.get('MAIL_FROM');

    // MAIL_ALLOWLIST (rehearsals on copies of production data): drop every
    // recipient outside it. Unset: unchanged.
    const allowlist = parseAllowlist(this.configService.get('MAIL_ALLOWLIST'));
    if (allowlist) {
      const to = allowedRecipients(email.to as any, allowlist);
      if (!to.length) {
        this.logger.warn({
          message: 'email dropped by MAIL_ALLOWLIST',
          subject: email.subject,
        });
        return null;
      }
      email = { ...email, to, cc: undefined, bcc: undefined };
    }

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
