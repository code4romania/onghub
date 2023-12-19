import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { QUEUES } from 'src/common/constants/queues.constants';
import { MailProcessor } from './services/mail-processor.service';
import { MailProviderModule } from 'src/providers/mail/mail.module';

@Global()
@Module({
  imports: [
    MailProviderModule,
    BullModule.registerQueue({
      name: QUEUES.MAILS,
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
