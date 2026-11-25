import { INestApplication } from '@nestjs/common';
import type { Provider } from 'oidc-provider';
import type { NextFunction, Request, Response } from 'express';
import {
  OIDC_OPTIONS,
  OIDC_PROVIDER,
  OIDC_ROUTE_PREFIX,
} from './oidc.constants';
import { OidcOptions } from './oidc.options';

const DISCOVERY_PATH = '/.well-known/openid-configuration';

export function isProviderPath(path: string): boolean {
  return path === DISCOVERY_PATH || path.startsWith(`${OIDC_ROUTE_PREFIX}/`);
}

/**
 * Mounts oidc-provider on the Express instance. Must run BEFORE `app.init()` /
 * `app.listen()`: Nest registers module middleware (JSON body parser) and the
 * router during init, so mounting here puts the provider ahead of them. The
 * provider parses its own bodies and Nest guards/pipes never see these routes;
 * rate limiting for them has to be Express middleware placed before this one.
 */
export function mountOidc(app: INestApplication): void {
  const provider = app.get<Provider | null>(OIDC_PROVIDER);
  if (!provider) return;

  const { issuerHost } = app.get<OidcOptions>(OIDC_OPTIONS);
  const callback = provider.callback();

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!isProviderPath(req.path)) return next();
    if (issuerHost && req.hostname !== issuerHost) return next();
    return callback(req, res);
  });
}
