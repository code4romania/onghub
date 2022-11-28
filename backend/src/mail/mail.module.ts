import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { QUEUES } from 'src/common/constants/queues.constants';
import { MailProcessor } from './services/mail-processor.service';
import { MailProviderModule } from 'src/providers/mail/mail.module';
import { MailListenerService } from './services/mail-listener.service';
import { UserModule } from 'src/modules/user/user.module';
import { OrganizationModule } from 'src/modules/organization/organization.module';

@Global()
@Module({
  imports: [
    MailProviderModule,
    BullModule.registerQueue({
      name: QUEUES.MAILS,
    }),
    UserModule,
    OrganizationModule,
  ],
  providers: [MailService, MailProcessor, MailListenerService],
  exports: [MailService],
})
export class MailModule {}
