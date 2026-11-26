import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataSource, In } from 'typeorm';
import { AuthConfigService } from 'src/common/config/auth.config';
import { EVENTS } from 'src/modules/notifications/constants/events.contants';
import RestrictOngEvent from 'src/modules/notifications/events/restrict-ong-event.class';
import { AuthTokenType } from '../enums/auth.enums';
import { AuthIdentityEntity } from '../entities/auth-identity.entity';
import { OidcPayloadEntity } from '../entities/oidc-payload.entity';
import { AuthIdentityFacade } from './auth-identity.facade';
import { AuthMailerService } from './auth-mailer.service';
import { AuthRateLimitService } from './auth-rate-limit.service';
import { OneTimeTokenService } from './one-time-token.service';
import { AuthEventService, AuthEventType } from './auth-event.service';

export interface IssuedInvite {
  loginUrl: string;
  code: string;
}

/**
 * The parts of the user lifecycle that used to be Cognito calls (O7):
 * invitation, re-invitation, and revoking every session when a user or an
 * organization is restricted or removed.
 */
@Injectable()
export class UserLoginLifecycle {
  private readonly logger = new Logger(UserLoginLifecycle.name);

  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly facade: AuthIdentityFacade,
    private readonly tokens: OneTimeTokenService,
    private readonly mailer: AuthMailerService,
    private readonly rateLimit: AuthRateLimitService,
    private readonly dataSource: DataSource,
    private readonly events: AuthEventService,
  ) {}

  /**
   * Creates the user's identity and an invitation (link + code, 30 days).
   * `sendEmail: false` when the caller puts the link in its own email (the
   * organization-approval email).
   */
  async invite(
    user: { id: number; email: string },
    options: { sentById?: number; sendEmail?: boolean } = {},
  ): Promise<IssuedInvite> {
    const { identity } = await this.facade.upsertIdentity({ userId: user.id });
    const issued = await this.tokens.issueLinkAndCode({
      identity,
      type: AuthTokenType.INVITE,
      sentTo: user.email,
      sentById: options.sentById,
    });
    if (options.sendEmail !== false) {
      await this.mailer.sendInvite(user.email, issued.link, issued.code);
    }
    await this.events.record({
      type: AuthEventType.INVITE_SENT,
      userId: user.id,
      reason: options.sendEmail === false ? 'approval-email' : 'invite-email',
    });
    return {
      loginUrl: this.mailer.loginLinkUrl(issued.link),
      code: issued.code,
    };
  }

  /** A new invitation, rate limited per invited user (1 / 10 min, 5 / day). */
  async resendInvite(
    user: { id: number; email: string },
    sentById?: number,
  ): Promise<void> {
    await this.rateLimit.assertCanInvite(user.id);
    await this.invite(user, { sentById });
  }

  /**
   * Ends everything a user could still use: NGO Hub refresh tokens and the
   * OIDC provider's sessions, grants and tokens (account_id = user.id). The
   * effect at /oidc/me is immediate; a client app's own session lives on
   * until it expires (decision 6).
   */
  async revokeAccess(userIds: number[]): Promise<void> {
    const ids = userIds.filter(Boolean);
    if (!ids.length) return;

    const identities = await this.dataSource
      .getRepository(AuthIdentityEntity)
      .find({ where: { userId: In(ids) }, select: { id: true } });
    for (const identity of identities) {
      await this.facade.revokeAllSessions(identity.id);
    }
    await this.dataSource
      .getRepository(OidcPayloadEntity)
      .delete({ accountId: In(ids.map(String)) });
    for (const userId of ids) {
      await this.events.record({ type: AuthEventType.ACCESS_REVOKED, userId });
    }
  }

  @OnEvent(EVENTS.RESTRICT_ORGANIZATION)
  async onOrganizationRestricted(event: RestrictOngEvent): Promise<void> {
    try {
      const users: { id: number }[] = await this.dataSource.query(
        `SELECT id FROM "user" WHERE organization_id = $1`,
        [event.organizationId],
      );
      await this.revokeAccess(users.map((u) => u.id));
    } catch (error) {
      this.logger.error({
        message: 'Could not revoke sessions of restricted organization',
        error,
      });
    }
  }
}
