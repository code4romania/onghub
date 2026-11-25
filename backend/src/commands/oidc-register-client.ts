/**
 * Registers an OIDC client and prints its secret ONCE.
 *
 *   npm run oidc:register-client -- --client-id vic \
 *     --redirect-uri https://vic-staging.example/login/ngohub/callback \
 *     [--redirect-uri http://localhost:5173/login/ngohub/callback] \
 *     [--post-logout-uri https://...] [--scopes "openid email profile"] \
 *     [--first-party] [--application-id 12]
 *
 * Rotate a secret:  npm run oidc:register-client -- --client-id vic --rotate
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { OidcClientService } from '../modules/oidc/services/oidc-client.service';

function parse(argv: string[]) {
  const out = {
    redirectUris: [] as string[],
    postLogoutRedirectUris: [] as string[],
  } as {
    clientId?: string;
    redirectUris: string[];
    postLogoutRedirectUris: string[];
    scopes?: string[];
    firstParty?: boolean;
    applicationId?: number;
    rotate?: boolean;
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => argv[++i];
    if (arg === '--client-id') out.clientId = value();
    else if (arg === '--redirect-uri') out.redirectUris.push(value());
    else if (arg === '--post-logout-uri')
      out.postLogoutRedirectUris.push(value());
    else if (arg === '--scopes')
      out.scopes = value()
        .split(/[\s,]+/)
        .filter(Boolean);
    else if (arg === '--first-party') out.firstParty = true;
    else if (arg === '--application-id') out.applicationId = Number(value());
    else if (arg === '--rotate') out.rotate = true;
    else throw new Error(`Unknown argument ${arg}`);
  }
  if (!out.clientId) throw new Error('--client-id is required');
  return out;
}

async function main() {
  const args = parse(process.argv.slice(2));
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const clients = app.get(OidcClientService, { strict: false });
    const secret = args.rotate
      ? await clients.rotateSecret(args.clientId)
      : (await clients.create({ ...args, clientId: args.clientId }))
          .clientSecret;
    // stdout only, once; store it in the client's secret store right away.
    process.stdout.write(
      `client_id=${args.clientId}\nclient_secret=${secret}\n`,
    );
  } finally {
    await app.close().catch(() => undefined);
  }
}

// Exit explicitly: Bull/Redis/cron handles from AppModule keep the process alive.
main().then(
  () => process.exit(0),
  (error) => {
    process.stderr.write(`${error?.message ?? error}\n`);
    process.exit(1);
  },
);
