import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { DataSource } from 'typeorm';
import { QUEUES } from 'src/common/constants/queues.constants';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthTokenType } from '../enums/auth.enums';
import { AuthIdentityFacade } from './auth-identity.facade';
import { AuthMailerService } from './auth-mailer.service';
import { OneTimeTokenService } from './one-time-token.service';
import { AuthEventService, AuthEventType } from './auth-event.service';
import { AUTH_TOKEN_TTL_MS } from '../auth.constants';

export interface MigrationReport {
  dryRun: boolean;
  users: number;
  created: number;
  existing: number;
  queued: number;
}

interface TransitionJob {
  userId: number;
}

/**
 * Moves NGO Hub users from Cognito to own auth (O9, port of VIC's
 * migrate-identities). Idempotent: a second run changes nothing.
 * - one auth_identity per user, legacy_cognito_username = cognito_id;
 * - email_verified_at stays NULL (Cognito marked emails verified on
 *   AdminCreateUser without proof); it is set at the first link/code login;
 * - PENDING users stay PENDING until their first login;
 * - one transition email per user is queued in a PAUSED queue and only sent
 *   after `auth:release-transition` (rate limited by the queue limiter).
 */
@Injectable()
export class AuthMigrationService {
  private readonly logger = new Logger(AuthMigrationService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly facade: AuthIdentityFacade,
    @InjectQueue(QUEUES.AUTH_TRANSITION)
    private readonly queue: Queue<TransitionJob>,
  ) {}

  async migrate({ dryRun }: { dryRun: boolean }): Promise<MigrationReport> {
    const users = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id', 'user.cognitoId'])
      .where('user.deleted_on IS NULL')
      .orderBy('user.id')
      .getMany();

    const report: MigrationReport = {
      dryRun,
      users: users.length,
      created: 0,
      existing: 0,
      queued: 0,
    };

    if (!dryRun) {
      // Paused before anything is added: nothing leaves until the release.
      await this.queue.pause();
    }

    for (const user of users) {
      if (dryRun) {
        const existing = await this.facade.findIdentity({ userId: user.id });
        existing ? report.existing++ : report.created++;
        continue;
      }
      const { created } = await this.facade.upsertIdentity({
        userId: user.id,
        legacyCognitoUsername: user.cognitoId ?? undefined,
      });
      created ? report.created++ : report.existing++;

      // jobId dedupes: re-running never queues a second email for a user.
      const jobId = `transition-${user.id}`;
      if (!(await this.queue.getJob(jobId))) {
        await this.queue.add(
          { userId: user.id },
          { jobId, removeOnComplete: true, attempts: 3 },
        );
        report.queued++;
      }
    }

    this.logger.log({ message: 'auth:migrate', ...report });
    return report;
  }

  /** Starts sending the held transition emails. */
  async release(): Promise<{ waiting: number }> {
    const waiting = await this.queue.getWaitingCount();
    await this.queue.resume();
    return { waiting };
  }

  /** Rollback (phase 3): forget every held transition email. */
  async drop(): Promise<void> {
    await this.queue.pause();
    await this.queue.empty();
  }

  async pending(): Promise<number> {
    return this.queue.getWaitingCount();
  }
}

/** Sends one transition email: a 30-day login link + code, no sender. */
@Processor(QUEUES.AUTH_TRANSITION)
export class AuthTransitionProcessor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly facade: AuthIdentityFacade,
    private readonly tokens: OneTimeTokenService,
    private readonly mailer: AuthMailerService,
    private readonly events: AuthEventService,
  ) {}

  @Process()
  async process(job: Job<TransitionJob>): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({
        where: { id: job.data.userId },
        select: { id: true, email: true },
      });
    if (!user) return; // deleted since the migration
    const identity = await this.facade.findIdentity({ userId: user.id });
    if (!identity) return;

    const issued = await this.tokens.issueLinkAndCode({
      identity,
      type: AuthTokenType.INVITE,
      sentTo: user.email,
      ttlMs: AUTH_TOKEN_TTL_MS.INVITE,
    });
    await this.mailer.sendTransition(user.email, issued.link, issued.code);
    await this.events.record({
      type: AuthEventType.INVITE_SENT,
      userId: user.id,
      reason: 'transition',
    });
  }
}
