import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [UserModule, OrganizationModule, MailModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
