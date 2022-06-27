import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';
import { QUEUES } from 'src/common/constants/queues.constants';
import { EmailProcessor } from './services/email-processor.service';
import { MailProviderModule } from 'src/providers/mail/mail.module';

@Module({
  imports: [
    MailProviderModule,
    BullModule.registerQueue({
      name: QUEUES.MAILS,
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor],
})
export class EmailModule {}
