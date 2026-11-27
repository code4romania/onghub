import type { Provider } from 'oidc-provider';
import {
  AuthEventService,
  AuthEventType,
} from 'src/modules/authentication/services/auth-event.service';

const accountOf = (ctx: any): number | null => {
  const id =
    ctx?.oidc?.account?.accountId ??
    ctx?.oidc?.session?.accountId ??
    ctx?.oidc?.entities?.AccessToken?.accountId;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const clientOf = (ctx: any): string | null =>
  ctx?.oidc?.client?.clientId ?? null;

/** Journals the provider's events (plan 5.6). Only error codes, never request data. */
export function journalProviderEvents(
  provider: Provider,
  events: AuthEventService,
): void {
  const on = (
    name: string,
    type: AuthEventType,
    reason?: (err: any) => string,
  ) =>
    provider.on(name as any, (ctx: any, err?: any) => {
      void events.record({
        type,
        userId: accountOf(ctx),
        clientId: clientOf(ctx),
        reason: reason ? reason(err) : null,
        ip: ctx?.ip ?? null,
      });
    });

  on('grant.success', AuthEventType.OIDC_GRANT_SUCCEEDED);
  on(
    'grant.error',
    AuthEventType.OIDC_GRANT_FAILED,
    (err) => err?.error ?? err?.name,
  );
  on(
    'authorization.error',
    AuthEventType.OIDC_AUTHORIZATION_FAILED,
    (err) => err?.error ?? err?.name,
  );
  on('server_error', AuthEventType.OIDC_SERVER_ERROR, (err) => err?.name);
  on('end_session.success', AuthEventType.OIDC_SESSION_ENDED);
  on('interaction.ended', AuthEventType.OIDC_INTERACTION_ENDED);
}
