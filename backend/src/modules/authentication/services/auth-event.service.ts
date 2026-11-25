import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthEventEntity } from '../entities/auth-event.entity';

export enum AuthEventType {
  LOGIN_REQUESTED = 'login.requested',
  LOGIN_SUCCEEDED = 'login.succeeded',
  LOGIN_FAILED = 'login.failed',
  INVITE_SENT = 'invite.sent',
  SESSION_REVOKED = 'session.revoked',
  ACCESS_REVOKED = 'access.revoked',
  OIDC_INTERACTION_ENDED = 'oidc.interaction.ended',
  OIDC_INTERACTION_DENIED = 'oidc.interaction.denied',
  OIDC_GRANT_SUCCEEDED = 'oidc.grant.succeeded',
  OIDC_GRANT_FAILED = 'oidc.grant.failed',
  OIDC_AUTHORIZATION_FAILED = 'oidc.authorization.failed',
  OIDC_SERVER_ERROR = 'oidc.server_error',
  OIDC_SESSION_ENDED = 'oidc.session.ended',
  OIDC_CLIENT_CREATED = 'oidc.client.created',
  OIDC_CLIENT_SECRET_ROTATED = 'oidc.client.secret_rotated',
}

export interface AuthEventInput {
  type: AuthEventType;
  userId?: number | null;
  clientId?: string | null;
  /** An error code or name, never free text from the request. */
  reason?: string | null;
  ip?: string | null;
}

/**
 * Append-only auth journal (O14, plan 5.6). Never stores emails, tokens,
 * codes or secrets. Recording never throws: a journal failure must not
 * break a login.
 */
@Injectable()
export class AuthEventService {
  private readonly logger = new Logger(AuthEventService.name);

  constructor(private readonly dataSource: DataSource) {}

  async record(event: AuthEventInput): Promise<void> {
    try {
      await this.dataSource.getRepository(AuthEventEntity).insert({
        type: event.type,
        userId: Number.isInteger(event.userId) ? event.userId : null,
        clientId: event.clientId?.slice(0, 200) ?? null,
        reason: event.reason?.slice(0, 200) ?? null,
        ip: event.ip?.slice(0, 64) ?? null,
      });
    } catch (error) {
      this.logger.warn({
        message: 'auth_event not recorded',
        type: event.type,
        error: error?.message,
      });
    }
  }
}
