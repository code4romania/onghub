import type { NextFunction, Request, Response } from 'express';
import type Redis from 'ioredis';

interface Limit {
  key: string;
  windowSeconds: number;
  limit: number;
}

const PER_IP = { windowSeconds: 60, limit: 120 };
const TOKEN_PER_CLIENT = { windowSeconds: 60, limit: 60 };

/** client_id from HTTP Basic auth (client_secret_basic), without parsing the body. */
function basicClientId(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith('Basic ')) return undefined;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    return decodeURIComponent(decoded.split(':')[0]) || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Fixed-window limits for the provider and interaction routes, as Express
 * middleware: Nest guards (ThrottlerGuard) never run on routes mounted with
 * app.use. Per IP everywhere; per client_id on /oidc/token as well.
 * Redis down → requests pass (the provider stays available).
 */
export function createOidcRateLimiter(redis: Redis) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const now = Math.floor(Date.now() / 1000);
    const limits: Limit[] = [{ key: `oidc:ip:${req.ip}`, ...PER_IP }];
    const clientId =
      req.path === '/oidc/token' ? basicClientId(req) : undefined;
    if (clientId)
      limits.push({ key: `oidc:token:${clientId}`, ...TOKEN_PER_CLIENT });

    try {
      const pipeline = redis.multi();
      const keys = limits.map((l) => {
        const key = `${l.key}:${Math.floor(now / l.windowSeconds)}`;
        pipeline.incr(key).expire(key, l.windowSeconds);
        return key;
      });
      const results = await pipeline.exec();
      const exceeded = keys.some(
        (_, i) => Number(results[i * 2][1]) > limits[i].limit,
      );
      if (exceeded) {
        res.status(429).json({ error: 'too_many_requests' });
        return;
      }
    } catch {
      // fail open
    }
    next();
  };
}
