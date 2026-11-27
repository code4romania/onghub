import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { AuthIdentityFacade } from 'src/modules/authentication/services/auth-identity.facade';
import { deleteExpiredOidcPayloads } from './oidc-pg.adapter';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Hourly: removes expired OIDC rows (an unauthenticated /oidc/auth writes one
 * interaction row per call; they expire in 10 minutes) and auth tokens and
 * sessions that ended more than 30 days ago. Idempotent: running on several
 * tasks at once is harmless.
 */
@Injectable()
export class OidcCleanupService {
  private readonly logger = new Logger(OidcCleanupService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly facade: AuthIdentityFacade,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async run(): Promise<{ oidc: number; tokens: number; sessions: number }> {
    try {
      const before = new Date(Date.now() - 30 * DAY_MS);
      const result = {
        oidc: await deleteExpiredOidcPayloads(this.dataSource),
        tokens: await this.facade.deleteTokensEndedBefore(before),
        sessions:
          await this.facade.deleteSessionsExpiredOrRevokedBefore(before),
      };
      this.logger.log({ message: 'auth cleanup', ...result });
      return result;
    } catch (error) {
      this.logger.error({ message: 'auth cleanup failed', error });
      return { oidc: 0, tokens: 0, sessions: 0 };
    }
  }
}
