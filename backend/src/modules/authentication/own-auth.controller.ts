import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthConfigService } from 'src/common/config/auth.config';
import {
  clearLoginNonceCookie,
  clearRefreshCookie,
  LOGIN_NONCE_COOKIE,
  REFRESH_COOKIE,
  requestClient,
  setLoginNonceCookie,
  setRefreshCookie,
} from './cookies';
import { LoginCodeDto, LoginLinkDto, RequestLoginDto } from './dto/auth.dto';
import { AuthErrorCode, AuthException } from './exceptions/auth.exception';
import { OneTimeTokenService } from './services/one-time-token.service';
import { OwnLoginService } from './services/own-login.service';
import { SessionTokens } from './services/session.service';

const AUTH_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

/** What the SPA gets after a login or refresh; the refresh token only travels in the cookie. */
export interface SessionResponse {
  accessToken: string;
  expiresIn: number;
}

/**
 * Endpoints with the same names as VIC 2.0. All 404 until own auth is
 * enabled (JWT_PRIVATE_KEY / JWT_PUBLIC_KEY / AUTH_TOKEN_KEY set).
 */
@Public()
@Controller('auth')
export class OwnAuthController {
  constructor(
    private readonly login: OwnLoginService,
    private readonly tokens: OneTimeTokenService,
    private readonly authConfig: AuthConfigService,
  ) {}

  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('web/login/request')
  async requestLogin(
    @Body() { email }: RequestLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.assertEnabled();
    const nonce = this.tokens.newBrowserNonce();
    setLoginNonceCookie(res, nonce);
    return this.login.requestLogin(email, nonce, undefined, req.ip);
  }

  @Throttle(AUTH_THROTTLE)
  @Get('token/:secret')
  async tokenInfo(@Param('secret') secret: string) {
    this.assertEnabled();
    return this.login.tokenInfo(secret);
  }

  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('token/:secret/resend')
  async resend(@Param('secret') secret: string): Promise<void> {
    this.assertEnabled();
    await this.login.resend(secret);
  }

  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('login-link')
  async loginWithLink(
    @Body() { token }: LoginLinkDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionResponse> {
    this.assertEnabled();
    return this.present(
      await this.login.loginWithLink(token, requestClient(req), req.ip),
      res,
    );
  }

  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('login-code')
  async loginWithCode(
    @Body() { email, code }: LoginCodeDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionResponse> {
    this.assertEnabled();
    const nonce = req.cookies?.[LOGIN_NONCE_COOKIE];
    if (!nonce) throw new AuthException(AuthErrorCode.AUTH_005);
    const session = await this.login.loginWithCode(
      email,
      code,
      nonce,
      requestClient(req),
      req.ip,
    );
    clearLoginNonceCookie(res);
    return this.present(session, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('web/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionResponse> {
    this.assertEnabled();
    try {
      return this.present(
        await this.login.refresh(req.cookies?.[REFRESH_COOKIE]),
        res,
      );
    } catch (error) {
      if (
        error instanceof AuthException &&
        error.code === AuthErrorCode.AUTH_008
      ) {
        clearRefreshCookie(res);
      }
      throw error;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('web/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.assertEnabled();
    await this.login.logout(req.cookies?.[REFRESH_COOKIE], req.ip);
    clearRefreshCookie(res);
  }

  private present(tokens: SessionTokens, res: Response): SessionResponse {
    // No refresh token after two tabs crossed: the browser already holds the new cookie.
    if (tokens.refreshToken) {
      setRefreshCookie(
        res,
        tokens.refreshToken,
        this.authConfig.refreshTtlDays,
      );
    }
    return { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn };
  }

  private assertEnabled(): void {
    if (!this.authConfig.enabled) throw new NotFoundException();
  }
}
