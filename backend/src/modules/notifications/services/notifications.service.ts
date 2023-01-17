import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IMailOptions,
  MAIL_OPTIONS,
} from 'src/mail/constants/template.constants';
import { MailService } from 'src/mail/services/mail.service';
import { OrganizationService } from 'src/modules/organization/services';
import { Role } from 'src/modules/user/enums/role.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { NOTIFICATIONS_ERRORS } from '../constants/errors.constants';
import { EVENTS } from '../constants/events.contants';
import ApproveOngRequestEvent from '../events/approve-ong-request-event.class';
import CreateOngRequestEvent from '../events/create-ong-request-event.class';
import DeleteAppRequestEvent from '../events/delete-app-request-event.class';
import DisableOngRequestEvent from '../events/disable-ong-request-event.class';
import RejectOngRequestEvent from '../events/reject-ong-request-event.class';
import RestrictOngEvent from '../events/restrict-ong-event.class';

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
          subtitle,
          cta: { link, label },
        },
      } = MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE;

      await this.mailService.sendEmail({
        to: superAdmins.map((user) => user.email),
        template,
        subject,
        context: {
          title,
          subtitle: subtitle(
            organziation.organizationGeneral.name,
            applicationName,
          ),
          cta: {
            link: link(organizationId.toString()),
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

  @OnEvent(EVENTS.CREATE_ORGANIZATION_REQUEST)
  async handleCreateOrganizationRequest(payload: CreateOngRequestEvent) {
    const { adminEmail, requestId } = payload;
    try {
      // 1. Send email to admin
      const adminMailOptions: IMailOptions =
        MAIL_OPTIONS.ORGANIZATION_CREATE_ADMIN;

      await this.mailService.sendEmail({
        to: adminEmail,
        template: adminMailOptions.template,
        subject: adminMailOptions.subject,
        context: {
          title: adminMailOptions.context.title,
          subtitle: adminMailOptions.context.subtitle(),
        },
      });

      // 2. Send emails for Super-Admin
      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });

      const superadminMailOptions: IMailOptions =
        MAIL_OPTIONS.ORGANIZATION_CREATE_SUPERADMIN;

      await this.mailService.sendEmail({
        to: superAdmins.map((item) => item.email),
        template: superadminMailOptions.template,
        subject: superadminMailOptions.subject,
        context: {
          title: superadminMailOptions.context.title,
          subtitle: superadminMailOptions.context.subtitle(),
          cta: {
            link: superadminMailOptions.context.cta.link(requestId.toString()),
            label: superadminMailOptions.context.cta.label,
          },
        },
      });
    } catch (error) {
      this.logger.error({
        ...NOTIFICATIONS_ERRORS.REQUEST_ONG_CREATE,
        error,
      });
    }
  }

  @OnEvent(EVENTS.APPROVE_ORGANIZATION_REQUEST)
  async handleApproveOrganizationRequest(payload: ApproveOngRequestEvent) {
    try {
      const { adminEmail } = payload;
      const {
        template,
        subject,
        context: {
          title,
          subtitle,
          cta: { label, link },
        },
      } = MAIL_OPTIONS.ORGANIZATION_REQUEST_APPROVAL;

      await this.mailService.sendEmail({
        to: adminEmail,
        template,
        subject,
        context: {
          title,
          subtitle: subtitle(),
          cta: {
            link: link(process.env.ONGHUB_URL),
            label,
          },
        },
      });
    } catch (error) {
      this.logger.error({
        ...NOTIFICATIONS_ERRORS.REQUEST_ONG_APPROVE,
        error,
      });
    }
  }

  @OnEvent(EVENTS.REJECT_ORGANIZATION_REQUEST)
  async handleRejectOrganizationRequest(payload: RejectOngRequestEvent) {
    try {
      const { adminEmail } = payload;

      const {
        template,
        subject,
        context: { title, subtitle },
      } = MAIL_OPTIONS.ORGANIZATION_REQUEST_REJECTION;

      await this.mailService.sendEmail({
        to: adminEmail,
        template,
        subject,
        context: {
          title,
          subtitle: subtitle(),
        },
      });
    } catch (error) {
      this.logger.error({
        ...NOTIFICATIONS_ERRORS.REQUEST_ONG_REJECT,
        error,
      });
    }
  }

  @OnEvent(EVENTS.DISABLE_ORGANIZATION_REQUEST)
  async handleDisableOrganizationRequest(payload: DisableOngRequestEvent) {
    try {
      const { organizationName } = payload;

      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });

      const {
        template,
        subject,
        context: { title, subtitle },
      } = MAIL_OPTIONS.ORGANIZATION_RESTRICT_SUPERADMIN;

      await this.mailService.sendEmail({
        to: superAdmins.map((superAdmin) => superAdmin.email),
        template,
        subject,
        context: {
          title,
          subtitle: subtitle(organizationName),
        },
      });
    } catch (error) {
      this.logger.error({
        ...NOTIFICATIONS_ERRORS.REQUEST_ONG_DISABLE,
        error,
      });
    }
  }

  @OnEvent(EVENTS.RESTRICT_ORGANIZATION)
  async handleRestrictOrganization(payload: RestrictOngEvent) {
    try {
      const { organizationId } = payload;

      const organization = await this.organizationService.findWithUsers(
        organizationId,
      );

      const admins = organization.users.filter(
        (user) => user.role === Role.ADMIN,
      );

      const {
        template,
        subject,
        context: { title, subtitle },
      } = MAIL_OPTIONS.ORGANIZATION_RESTRICT_ADMIN;

      await this.mailService.sendEmail({
        to: admins.map((admin) => admin.email),
        template,
        subject,
        context: {
          title,
          subtitle: subtitle(organization.organizationGeneral.name),
        },
      });
    } catch (error) {
      this.logger.error({
        ...NOTIFICATIONS_ERRORS.RESTRICT_ONG,
        error,
      });
    }
  }
}
