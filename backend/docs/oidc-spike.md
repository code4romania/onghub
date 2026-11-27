# O0 spike: `oidc-provider` in the CommonJS NestJS backend

Status: **works**; built out in O10–O15 on `feat/ngohub-own-auth` (26 November 2026). The spike notes below are kept as written; "Since the spike" at the end says what changed.

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

## Since the spike (O10–O15)

Done: O1 (Node 22 image), O3 (e2e on a local per-worker database, `test/oidc-sso.e2e-spec.ts` runs the real `AppModule`), O10 (Postgres `oidc_payload` adapter, `oidc_client` table with sealed secrets, `oidc:register-client`, localhost redirects only with `OIDC_ALLOW_LOCALHOST_REDIRECTS=true`), O11 (SPA interaction page), O12 (`organization` scope and claim, `oidc:export-orgs`), O13 (logout, session end from NGO Hub, cleanup, CORS), O14 (`auth_event` journal), O15 (super-admin panel for an application's client, `application/:id/oidc-client`).

Three more provider problems, found by running VIC's login against it in Chrome (26 November 2026), each with an e2e test:

8. **`prompt=login` was not honoured.** The interaction page finished with whatever NGO Hub session the browser had. Now `GET /interaction/:uid` returns `freshLogin`, the page asks for the code, and `POST /interaction/:uid/login` refuses (403 `FRESH_LOGIN_REQUIRED`) a token issued before the interaction started.
9. **Switching accounts lost the interaction.** When another account logs in over an existing OIDC session, the library ends the old session first and revokes its grants. The adapter's `revokeByGrantId` deleted every row with that grant id, including the paused Interaction, so the resume failed with "interaction session not found". It now keeps Interaction and Session rows.
10. **helmet's `form-action 'self'` blocked the redirect after the library's auto-submitted pages** (Chrome applies it to redirects after a form POST), leaving a blank "Submitting Callback" page. The directive is dropped on provider responses only; the library still adds its script hashes.

Still open: key and secret loading from Secrets Manager (`OIDC_JWKS`, `OIDC_COOKIE_KEYS` are required in production; outside it they are generated per boot), hop count for `TRUST_PROXY_HOPS` (T0), O16 after the production runbook.
