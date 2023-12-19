import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailConfigService } from 'src/common/config/email-config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: EmailConfigService,
    }),
  ],
  exports: [MailerModule],
})
export class MailProviderModule {}
