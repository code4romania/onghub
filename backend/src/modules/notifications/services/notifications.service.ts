import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MAIL_OPTIONS } from 'src/mail/constants/template.constants';
import { MailService } from 'src/mail/services/mail.service';
import { OrganizationService } from 'src/modules/organization/services';
import { Role } from 'src/modules/user/enums/role.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { NOTIFICATIONS_ERRORS } from '../constants/errors.constants';
import { EVENTS } from '../constants/events.contants';
import DeleteAppRequestEvent from '../events/delete-app-request-event.class';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(EVENTS.DELETE_APP_REQUEST)
  async handleDeleteOngApplicationRequest(payload: DeleteAppRequestEvent) {
    try {
      const { organizationId, applicationName } = payload;

      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });

      const organziation = await this.organizationService.findWithRelations(
        organizationId,
      );

      // send email to admin to delete the application
      const {
        template,
        subject,
        context: {
          title,
          cta: { label },
        },
      } = MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE;

      await this.mailService.sendEmail({
        to: superAdmins.map((user) => user.email),
        template,
        subject,
        context: {
          title,
          subtitle:
            MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE.context.subtitle(
              organziation.organizationGeneral.name,
              applicationName,
            ),
          cta: {
            link: MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE.context.cta.link(
              organizationId.toString(),
            ),
            label,
          },
        },
      });
    } catch (error) {
      this.logger.error({
        ...NOTIFICATIONS_ERRORS.REQUEST_APP_DELETE,
        error,
      });
    }
  }
}
