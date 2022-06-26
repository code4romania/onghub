import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { QUEUES } from 'src/common/constants/queues.constants';
import { EmailProcessor } from './services/email-processor.service';
import { EmailConfigService } from './config/email-config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: EmailConfigService,
    }),
    BullModule.registerQueue({
      name: QUEUES.MAILS,
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor],
})
export class EmailModule {}
