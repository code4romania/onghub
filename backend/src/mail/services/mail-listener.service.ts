import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganizationService } from 'src/modules/organization/services';
import { Role } from 'src/modules/user/enums/role.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { MAIL_EVENTS } from '../constants/mail-events.constants';
import { MAIL_OPTIONS } from '../constants/template.constants';
import DeleteAppRequest from '../events/delete-app-request.class';
import { MailService } from './mail.service';

@Injectable()
export class MailListenerService {
  private readonly logger = new Logger(MailListenerService.name);

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(MAIL_EVENTS.DELETE_APP_REQUEST)
  async handleDeleteOngApplicationRequest(payload: DeleteAppRequest) {
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
      this.logger.error('Error on delete ong application request', error);
    }
  }
}
