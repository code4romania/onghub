# O0 spike: `oidc-provider` in the CommonJS NestJS backend

Status: **works**. Branch `spike/o0-oidc-provider`. Not deployable until O1 (the Docker image is still Node 16).

## Versions

| Package | Version | Note |
|---|---|---|
| Node | ≥ 22.12 (tested 22.17.0) | `require(esm)` without a flag; `process.getBuiltinModule` (≥ 22.3) |
| `oidc-provider` | 9.15.1 (exact) | ESM-only; depends on `jose` 6, `koa` 3 |
| `@types/oidc-provider` | 9.15.0 (exact, dev) | the package ships no types |

## How it is wired

- `src/modules/oidc/oidc-provider.loader.ts` loads the library with Node's own `require`, obtained through `process.getBuiltinModule('node:module').createRequire`. Plain `import`/`require` would also work in the compiled app, but not under Jest (see the problems below).
- `OidcModule.register({ imports, accountSource })` provides `OIDC_PROVIDER` (or `null` when `OIDC_ISSUER` is unset, which means the feature is off) and the JSON interaction controller.
- `mountOidc(app)` in `main.ts` runs right after `helmet()` and **before** `app.listen()`/`app.init()`. Nest registers module middleware (the JSON body parser in `AppModule.configure`) and the router during init, so the provider sits ahead of them. Body parsing, `ValidationPipe` and global guards never run on `/oidc/*` or `/.well-known/openid-configuration`.
- All provider routes use the `/oidc/` prefix (`OIDC_ROUTES`), including disabled ones. Discovery stays at `/.well-known/openid-configuration`. When `OIDC_ISSUER_HOST` is set, the provider only answers for that Host.
- `/interaction/:uid` (GET details, POST `login`, POST `abort`) is a normal Nest controller, so the global `JwtAuthGuard` applies to `login`. The user comes from the NGO Hub session Bearer, and the interaction comes from the `_interaction` cookie (the uid in the URL must match it).

## Problems found

1. **Jest replaces `require` *and* the `module` builtin.** `createRequire` imported from `node:module` inside a test still goes through Jest's loader and fails on `import`. `process.getBuiltinModule('node:module')` returns the real builtin, so the provider is loaded by Node, outside the sandbox.
2. **Cross-realm config objects.** Under Jest our code runs in a `vm` context. The provider validates its config with `isPlainObject` (prototype === *its* `Object.prototype`) and throws `features.X must be an own property`. `toProviderRealm()` re-creates our plain objects and arrays in the main realm, and leaves library objects (the interaction policy, an Array subclass) untouched. Outside Jest this is a harmless shallow copy.
3. **`findAccount` returning `undefined` for an existing session crashes `/oidc/auth`** (500 in the consent prompt: `oidc.grant` undefined). The library only re-prompts login when `session.accountId` is missing. A custom `login` check, `account_unavailable`, now forces the interaction, so restricting a user or organization blocks SSO on the next `/oidc/auth`. Covered by an e2e test.
4. **Endpoint URLs in discovery follow the request Host**, not the issuer. In production this is correct only if the ALB/CloudFront forwards the issuer host (`provider.proxy = true` trusts `X-Forwarded-*`). Hop count and forwarded headers are on the T0 list.
5. **Denial reasons must not reach the client.** `error_description` from `interactionResult` is passed through to the redirect, so it is kept generic. The reason goes to the SPA in the login response (`denied`).
6. **No `loadExistingGrant` auto-consent by default.** First-party clients (`first_party` extra metadata) get a grant for exactly the requested scopes, and the library has already filtered those by the client's `scope`.
7. Booting the real app with `backend/.env` points at the **staging RDS** (`migrationsRun: true`). Local runs must override `DATABASE_*`. For the smoke test I used a throwaway local `onghub_spike` DB.

## Verified

- `test/oidc.e2e-spec.ts` (7 tests, `npm run test:e2e -- oidc`): discovery (code only, S256 only, RS256 only, no registration/introspection); the full code + PKCE flow with `iss` in the response (RFC 9207); the ID token holds only `sub` plus the protocol claims; `/oidc/me`; code replay → `invalid_grant`; PKCE required; no refresh token; restricted account → `/oidc/me` 401 at once; login of an inactive account → client gets only `access_denied`; existing session → silent SSO, then re-prompt after restriction; the interaction login needs both the session and the `_interaction` cookie.
- The real `AppModule` (`node dist/main`, local DB) serves discovery, `/oidc/auth` → 303 to the SPA interaction URL, existing Nest routes unaffected, and `POST /interaction/:uid/login` without a token → 401.
- `nest build` output keeps the dynamic loader (no ESM `import` emitted).

## Left for later issues

- O10: Postgres `oidc_payload` adapter (in-memory now, so the library warns), `oidc_client` table and `findClient` (static clients from `OIDC_STATIC_CLIENTS` now), `localhost` redirect rule, rate-limit middleware ahead of `mountOidc`, key and secret loading from Secrets Manager (ephemeral keys outside production now).
- O11: SPA pages, consent for non-first-party clients, CORS for `/interaction/*` on the issuer host.
- O12: `organization` scope and claim.
- O3: test infra. These e2e tests use a minimal module with a fake session guard and fake accounts, because `AppModule` in tests needs the DB, Redis and Cognito config.
- O1: Dockerfile/engines/workflow on Node 22.12+ (blocker for deploying any of this).
