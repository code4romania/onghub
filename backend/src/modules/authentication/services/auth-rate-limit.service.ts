import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/shared/redis/redis-provider.module';
import { AuthErrorCode, AuthException } from '../exceptions/auth.exception';

interface Window {
  name: string;
  seconds: number;
  limit: number;
}

/** Emitting a login email: 1 a minute, 5 an hour, per email address. */
const ISSUE_WINDOWS: Window[] = [
  { name: 'minute', seconds: 60, limit: 1 },
  { name: 'hour', seconds: 60 * 60, limit: 5 },
];

/** Invitations: 1 per 10 minutes, 5 a day, per invited user. */
const INVITE_WINDOWS: Window[] = [
  { name: '10min', seconds: 10 * 60, limit: 1 },
  { name: 'day', seconds: 24 * 60 * 60, limit: 5 },
];

/** Verifying links/codes, per client address, whatever the account. */
const VERIFY_PER_IP_WINDOWS: Window[] = [
  { name: '10min', seconds: 10 * 60, limit: 30 },
  { name: 'day', seconds: 24 * 60 * 60, limit: 200 },
];

/** Fixed-window counters in Redis (INCR + EXPIRE). Every call counts, allowed or not. */
@Injectable()
export class AuthRateLimitService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Keyed by the (normalized) email, not the identity, so an unknown address
   * is counted the same way and the response cannot tell the two apart.
   */
  public async assertCanIssueLogin(email: string): Promise<void> {
    await this.hit(`auth:issue:${this.key(email)}`, ISSUE_WINDOWS);
  }

  public async assertCanInvite(userId: number): Promise<void> {
    await this.hit(`auth:invite:${userId}`, INVITE_WINDOWS);
  }

  public async assertCanVerify(ip: string): Promise<void> {
    if (!ip) return;
    await this.hit(`auth:verify:ip:${ip}`, VERIFY_PER_IP_WINDOWS);
  }

  /** Emails are hashed: no address in Redis keys. */
  private key(email: string): string {
    return createHash('sha256')
      .update((email ?? '').trim().toLowerCase())
      .digest('hex')
      .slice(0, 32);
  }

  private async hit(prefix: string, windows: Window[]): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const pipeline = this.redis.multi();
    const keys = windows.map((window) => {
      const key = `${prefix}:${window.name}:${Math.floor(now / window.seconds)}`;
      pipeline.incr(key).expire(key, window.seconds);
      return key;
    });
    const results = await pipeline.exec();
    const exceeded = keys.some((_, index) => {
      const [error, count] = results[index * 2];
      if (error) throw error;
      return Number(count) > windows[index].limit;
    });
    if (exceeded) {
      throw new AuthException(AuthErrorCode.AUTH_010);
    }
  }
}
