import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { QUEUES } from 'src/common/constants/queues.constants';
import { MailProcessor } from './services/mail-processor.service';
import { MailProviderModule } from 'src/providers/mail/mail.module';

@Module({
  imports: [
    MailProviderModule,
    BullModule.registerQueue({
      name: QUEUES.MAILS,
    }),
  ],
  providers: [MailService, MailProcessor],
})
export class MailModule {}
