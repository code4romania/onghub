import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

/** NGO Hub's own session tokens (never the OIDC tokens issued to clients). */
export const JWT_ISSUER = 'ngohub-api';
export const JWT_AUDIENCE = 'ngohub-web';

const decodePem = (base64?: string): string | undefined =>
  base64 ? Buffer.from(base64, 'base64').toString('utf8') : undefined;

const splitList = (value: string): string[] =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

/** Typed access to the own-auth settings (keys arrive base64 encoded on one line). */
@Injectable()
export class AuthConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  get privateKey(): string {
    return decodePem(this.configService.get('JWT_PRIVATE_KEY'));
  }

  get publicKey(): string {
    return decodePem(this.configService.get('JWT_PUBLIC_KEY'));
  }

  get keyId(): string {
    return this.configService.get('JWT_KEY_ID') || 'ngohub-1';
  }

  get accessTokenTtlSeconds(): number {
    return +(this.configService.get('JWT_ACCESS_TTL_SECONDS') || 900);
  }

  get refreshTtlDays(): number {
    return +(this.configService.get('REFRESH_TTL_DAYS_WEB') || 7);
  }

  /** Super admins: a shorter session with a fixed end (plan 5.5). */
  get superAdminSessionHours(): number {
    return +(this.configService.get('SUPER_ADMIN_SESSION_HOURS') || 12);
  }

  /** HMAC key for emailed secrets; also the root of secret-box keys. */
  get authTokenKey(): Buffer {
    const raw = this.configService.get<string>('AUTH_TOKEN_KEY');
    if (!raw) throw new Error('AUTH_TOKEN_KEY is not set');
    return Buffer.from(raw, 'base64');
  }

  get webAppUrl(): string {
    return (
      this.configService.get<string>('WEB_APP_URL') ||
      this.configService.get<string>('ONGHUB_URL') ||
      ''
    ).replace(/\/+$/, '');
  }

  get corsOrigins(): string[] {
    return splitList(this.configService.get('CORS_ORIGINS'));
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      signOptions: {
        algorithm: 'RS256',
        keyid: this.keyId,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        expiresIn: this.accessTokenTtlSeconds,
      },
      verifyOptions: {
        algorithms: ['RS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    };
  }
}
