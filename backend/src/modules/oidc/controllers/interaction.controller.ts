import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Optional,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Provider } from 'oidc-provider';
import { Public } from 'src/common/decorators/public.decorator';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import {
  INTERACTION_PATH,
  OIDC_ACCOUNT_SOURCE,
  OIDC_PROVIDER,
} from '../oidc.constants';
import { OidcAccountSource } from '../oidc-account-source.interface';
import {
  AuthEventService,
  AuthEventType,
} from 'src/modules/authentication/services/auth-event.service';

/**
 * JSON endpoints the SPA calls on the issuer host while an authorization
 * request is paused. The interaction is read from the `_interaction` cookie,
 * never from the URL; the URL uid must match it.
 */
@Controller(INTERACTION_PATH.slice(1))
export class InteractionController {
  constructor(
    @Inject(OIDC_PROVIDER) private readonly provider: Provider | null,
    @Inject(OIDC_ACCOUNT_SOURCE) private readonly accounts: OidcAccountSource,
    @Optional() private readonly events?: AuthEventService,
  ) {}

  /**
   * Called by the NGO Hub SPA on logout (credentials: 'include'): the NGO Hub
   * logout runs on the API host and cannot see the issuer's `_session` cookie,
   * so this closes the browser's OIDC session too. Public and idempotent;
   * JSON-only, so a cross-site form cannot trigger it.
   */
  @Public()
  @HttpCode(204)
  @Post('session/end')
  async endSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!req.is('application/json')) {
      throw new BadRequestException('application/json required');
    }
    const provider = this.oidc;
    const ctx = (provider as any).createContext(req, res);
    const cookieOptions = {
      signed: true,
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: req.secure,
    };
    const name = provider.cookieName('session');
    const sessionId = ctx.cookies.get(name, cookieOptions);
    if (sessionId) {
      const session = await provider.Session.find(sessionId);
      await session?.destroy();
    }
    ctx.cookies.set(name, null, cookieOptions);
  }

  @Public()
  @Get(':uid')
  async details(
    @Param('uid') uid: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const details = await this.load(uid, req, res);
    const client = await this.oidc.Client.find(
      details.params.client_id as string,
    );
    return {
      prompt: details.prompt.name,
      // The client asked for a fresh login (prompt=login, e.g. after a logout in the client): the
      // NGO Hub session the browser already has is not enough, the user logs in again.
      freshLogin: requiresFreshLogin(details),
      client: {
        name: client?.clientName ?? client?.clientId,
        logo: client?.logoUri,
      },
      scopes: String(details.params.scope ?? '')
        .split(' ')
        .filter(Boolean),
    };
  }

  /** Finishes the login prompt with the user from the NGO Hub session (Bearer). */
  @HttpCode(200)
  @Post(':uid/login')
  async login(
    @Param('uid') uid: string,
    @ExtractUser('id') userId: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const details = await this.load(uid, req, res);
    if (details.prompt.name === 'consent') {
      return this.finishFirstPartyConsent(details, userId, req, res);
    }
    if (details.prompt.name !== 'login') {
      throw new BadRequestException('Unexpected prompt');
    }
    // prompt=login: only an NGO Hub login made after this interaction started may finish it.
    if (
      requiresFreshLogin(details) &&
      bearerIssuedAt(req) < Number(details.iat ?? Infinity)
    ) {
      throw new ForbiddenException({
        message: 'A fresh login is required',
        errorCode: 'FRESH_LOGIN_REQUIRED',
      });
    }

    // Decision 5: NGO Hub only checks user + organization ACTIVE. NGO Hub
    // shows the reason; the client only learns `access_denied`.
    if (!(await this.accounts.findActive(String(userId)))) {
      await this.events?.record({
        type: AuthEventType.OIDC_INTERACTION_DENIED,
        userId,
        clientId: String(details.params.client_id ?? ''),
        reason: 'account_inactive',
        ip: req.ip,
      });
      const redirectTo = await this.oidc.interactionResult(
        req,
        res,
        { error: 'access_denied', error_description: 'End-User denied access' },
        { mergeWithLastSubmission: false },
      );
      return { redirectTo, denied: 'account_inactive' };
    }

    const redirectTo = await this.oidc.interactionResult(
      req,
      res,
      { login: { accountId: String(userId) } },
      // If an OIDC session belongs to another account, the Bearer user wins
      // and nothing from the previous submission is reused.
      { mergeWithLastSubmission: false },
    );
    return { redirectTo };
  }

  @Public()
  @HttpCode(200)
  @Post(':uid/abort')
  async abort(
    @Param('uid') uid: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.load(uid, req, res);
    const redirectTo = await this.oidc.interactionResult(
      req,
      res,
      {
        error: 'access_denied',
        error_description: 'End-User aborted interaction',
      },
      { mergeWithLastSubmission: false },
    );
    return { redirectTo };
  }

  private get oidc(): Provider {
    if (!this.provider) throw new NotFoundException();
    return this.provider;
  }

  /**
   * A consent step reaches NGO Hub only when a client asks for it
   * (prompt=consent). First-party clients have no consent screen: the user
   * the OIDC session belongs to finishes it, with the requested scopes.
   * Third-party consent is not supported.
   */
  private async finishFirstPartyConsent(
    details: Awaited<ReturnType<Provider['interactionDetails']>>,
    userId: number,
    req: Request,
    res: Response,
  ) {
    const provider = this.oidc;
    const clientId = String(details.params.client_id ?? '');
    const client = await provider.Client.find(clientId);
    if (!client?.['first_party']) {
      throw new BadRequestException('Unexpected prompt');
    }
    const accountId = details.session?.accountId;
    if (!accountId || accountId !== String(userId)) {
      throw new ForbiddenException('Another account owns this session');
    }
    const existing = details.grantId
      ? await provider.Grant.find(details.grantId)
      : undefined;
    const grant =
      existing && existing.accountId === accountId
        ? existing
        : new provider.Grant({ accountId, clientId });
    grant.addOIDCScope(String(details.params.scope ?? 'openid'));
    const grantId = await grant.save();
    const redirectTo = await provider.interactionResult(
      req,
      res,
      { consent: { grantId } },
      { mergeWithLastSubmission: true },
    );
    return { redirectTo };
  }

  private async load(uid: string, req: Request, res: Response) {
    let details: Awaited<ReturnType<Provider['interactionDetails']>>;
    try {
      details = await this.oidc.interactionDetails(req, res);
    } catch {
      throw new NotFoundException('Interaction not found or expired');
    }
    if (details.uid !== uid) {
      throw new BadRequestException('Interaction mismatch');
    }
    return details;
  }
}

/** The authorization request had prompt=login. */
function requiresFreshLogin(details: {
  params: Record<string, unknown>;
}): boolean {
  return String(details.params?.prompt ?? '')
    .split(' ')
    .includes('login');
}

/**
 * `iat` (seconds) of the NGO Hub access token on this request; the guard has
 * already verified it. 0 when it cannot be read, which never counts as fresh.
 */
function bearerIssuedAt(req: Request): number {
  try {
    const token = String(req.headers.authorization ?? '').replace(
      /^Bearer /i,
      '',
    );
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString(),
    );
    return Number(payload.iat) || 0;
  } catch {
    return 0;
  }
}
