import { createHash, generateKeyPairSync, randomBytes } from 'node:crypto';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { OidcModule } from 'src/modules/oidc/oidc.module';
import { mountOidc } from 'src/modules/oidc/oidc.mount';
import {
  OIDC_ACCOUNT_SOURCE,
  OIDC_PROVIDER,
} from 'src/modules/oidc/oidc.constants';
import {
  OidcAccount,
  OidcAccountSource,
} from 'src/modules/oidc/oidc-account-source.interface';

/** Stands in for the NGO Hub session guard: `Authorization: Bearer user-<id>`. */
@Injectable()
class FakeSessionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    if (
      this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ])
    ) {
      return true;
    }
    const req = ctx.switchToHttp().getRequest();
    const match = /^Bearer user-(\d+)$/.exec(req.headers.authorization ?? '');
    if (!match) throw new UnauthorizedException();
    req.user = { id: Number(match[1]) };
    return true;
  }
}

class FakeAccounts implements OidcAccountSource {
  readonly active = new Map<string, OidcAccount>();
  async findActive(id: string) {
    return this.active.get(id);
  }
}

const ISSUER = 'http://localhost:3001';
const REDIRECT_URI = 'http://localhost:5173/login/ngohub/callback';
const CLIENT_ID = 'vic-test';
const CLIENT_SECRET = randomBytes(32).toString('base64url');

function signingKey() {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  return {
    ...(privateKey.export({ format: 'jwk' }) as object),
    kid: 'test',
    alg: 'RS256',
    use: 'sig',
  };
}

const b64url = (b: Buffer) => b.toString('base64url');
const basicAuth = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
const pathOf = (url: string) => {
  const u = new URL(url, ISSUER);
  return u.pathname + u.search;
};

describe('OIDC provider (e2e spike)', () => {
  let app: INestApplication;
  let accounts: FakeAccounts;

  beforeAll(async () => {
    accounts = new FakeAccounts();
    const moduleRef = await Test.createTestingModule({
      imports: [
        OidcModule.register({
          accountSource: { provide: OIDC_ACCOUNT_SOURCE, useValue: accounts },
          options: {
            issuer: ISSUER,
            interactionUrl: 'http://localhost:3000/interaction',
            jwks: { keys: [signingKey()] },
            cookieKeys: [randomBytes(32).toString('base64url')],
            clients: [
              {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                client_name: 'VIC',
                redirect_uris: [REDIRECT_URI],
                scope: 'openid email profile',
                first_party: true,
              },
            ],
          },
        }),
      ],
      providers: [{ provide: APP_GUARD, useClass: FakeSessionGuard }],
    }).compile();

    app = moduleRef.createNestApplication();
    mountOidc(app);
    app.get(OIDC_PROVIDER).on('server_error', (_ctx, err) => {
      throw err;
    });
    await app.init();
  });

  afterAll(() => app?.close());

  beforeEach(() => {
    accounts.active.clear();
    accounts.active.set('42', {
      id: 42,
      email: 'ana@ong.ro',
      name: 'Ana',
      emailVerified: true,
    });
  });

  /** Runs /oidc/auth → interaction → login; returns { agent, code } */
  async function authorize(userId = 42) {
    const agent = request.agent(app.getHttpServer());
    const verifier = b64url(randomBytes(32));
    const challenge = b64url(createHash('sha256').update(verifier).digest());
    const state = b64url(randomBytes(16));

    const auth = await agent.get('/oidc/auth').query({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      nonce: 'n-1',
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    expect(auth.status).toBe(303);
    // devInteractions off: we get a redirect to our SPA, never the library's login form.
    expect(auth.text ?? '').not.toMatch(/<form/i);
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    expect(auth.headers.location).toBe(
      `http://localhost:3000/interaction/${uid}`,
    );

    const info = await agent.get(`/interaction/${uid}`).expect(200);
    expect(info.body).toMatchObject({
      prompt: 'login',
      client: { name: 'VIC' },
    });

    const login = await agent
      .post(`/interaction/${uid}/login`)
      .set('Authorization', `Bearer user-${userId}`)
      .expect(200);

    const resume = await agent.get(pathOf(login.body.redirectTo));
    return { agent, verifier, state, login, resume };
  }

  it('serves discovery under /oidc with code + S256 only', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/.well-known/openid-configuration')
      .set('Host', 'localhost:3001') // endpoint URLs follow the request host (issuer host in prod)
      .expect(200);
    expect(body.issuer).toBe(ISSUER);
    expect(body.authorization_endpoint).toBe(`${ISSUER}/oidc/auth`);
    expect(body.token_endpoint).toBe(`${ISSUER}/oidc/token`);
    expect(body.jwks_uri).toBe(`${ISSUER}/oidc/jwks`);
    expect(body.userinfo_endpoint).toBe(`${ISSUER}/oidc/me`);
    expect(body.response_types_supported).toEqual(['code']);
    expect(body.code_challenge_methods_supported).toEqual(['S256']);
    expect(body.id_token_signing_alg_values_supported).toEqual(['RS256']);
    expect(body.registration_endpoint).toBeUndefined();
    expect(body.introspection_endpoint).toBeUndefined();
  });

  it('completes code + PKCE, userinfo works, code replay fails', async () => {
    const { agent, verifier, state, resume } = await authorize();
    expect(resume.status).toBe(303);
    const cb = new URL(resume.headers.location);
    expect(cb.origin + cb.pathname).toBe(REDIRECT_URI);
    expect(cb.searchParams.get('state')).toBe(state);
    expect(cb.searchParams.get('iss')).toBe(ISSUER);
    const code = cb.searchParams.get('code');

    const exchange = () =>
      agent
        .post('/oidc/token')
        .set('Authorization', basicAuth)
        .type('form')
        .send({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier,
        });

    const token = await exchange().expect(200);
    expect(token.body.id_token).toBeDefined();
    expect(token.body.refresh_token).toBeUndefined();
    const idPayload = JSON.parse(
      Buffer.from(token.body.id_token.split('.')[1], 'base64url').toString(),
    );
    expect(idPayload).toMatchObject({
      iss: ISSUER,
      aud: CLIENT_ID,
      sub: '42',
      nonce: 'n-1',
    });
    expect(idPayload.email).toBeUndefined(); // conformIdTokenClaims

    const me = await request(app.getHttpServer())
      .get('/oidc/me')
      .set('Authorization', `Bearer ${token.body.access_token}`)
      .expect(200);
    expect(me.body).toEqual({
      sub: '42',
      email: 'ana@ong.ro',
      email_verified: true,
      name: 'Ana',
    });

    const replay = await exchange();
    expect(replay.status).toBe(400);
    expect(replay.body.error).toBe('invalid_grant');
  });

  it('rejects /oidc/me as soon as the account is no longer active', async () => {
    const { agent, verifier, resume } = await authorize();
    const code = new URL(resume.headers.location).searchParams.get('code');
    const token = await agent
      .post('/oidc/token')
      .set('Authorization', basicAuth)
      .type('form')
      .send({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      })
      .expect(200);

    accounts.active.delete('42');
    await request(app.getHttpServer())
      .get('/oidc/me')
      .set('Authorization', `Bearer ${token.body.access_token}`)
      .expect(401);
  });

  it('requires PKCE', async () => {
    const res = await request(app.getHttpServer()).get('/oidc/auth').query({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid',
      state: 's',
    });
    expect(res.status).toBe(303);
    const loc = new URL(res.headers.location);
    expect(loc.searchParams.get('error')).toBe('invalid_request');
  });

  it('login endpoint needs a session and the matching interaction cookie', async () => {
    const server = app.getHttpServer();
    await request(server).post('/interaction/abc/login').expect(401);
    await request(server)
      .post('/interaction/abc/login')
      .set('Authorization', 'Bearer user-42')
      .expect(404); // no _interaction cookie
  });

  it('denies login for an inactive account; client only gets access_denied', async () => {
    accounts.active.clear();
    const { login, resume } = await authorize(42);
    expect(login.body.denied).toBe('account_inactive');
    expect(resume.status).toBe(303);
    const cb = new URL(resume.headers.location);
    expect(cb.origin + cb.pathname).toBe(REDIRECT_URI);
    expect(cb.searchParams.get('error')).toBe('access_denied');
    expect(cb.searchParams.get('code')).toBeNull();
    expect(cb.searchParams.get('error_description')).not.toMatch(/active/i);
  });

  it('existing session: SSO without prompt, but re-prompts once the account is restricted', async () => {
    const { agent, verifier } = await authorize();
    expect(verifier).toBeDefined();

    const again = () =>
      agent.get('/oidc/auth').query({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email',
        state: 's2',
        code_challenge: b64url(
          createHash('sha256').update('x'.repeat(43)).digest(),
        ),
        code_challenge_method: 'S256',
      });

    const sso = await again();
    expect(sso.status).toBe(303);
    expect(new URL(sso.headers.location).searchParams.get('code')).toBeTruthy();

    accounts.active.delete('42');
    const blocked = await again();
    expect(blocked.status).toBe(303);
    expect(blocked.headers.location).toMatch(
      /^http:\/\/localhost:3000\/interaction\//,
    );
  });
});
