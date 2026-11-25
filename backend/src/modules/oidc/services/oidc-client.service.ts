import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { DataSource } from 'typeorm';
import { AuthConfigService } from 'src/common/config/auth.config';
import { OidcClientEntity } from 'src/modules/authentication/entities/oidc-client.entity';
import { OidcClientStatus } from 'src/modules/authentication/enums/auth.enums';
import {
  openSecretWithAny,
  sealSecret,
} from 'src/modules/authentication/services/secret-box';
import { SUPPORTED_SCOPES } from '../oidc.provider-factory';

/** HKDF purpose for client secrets: separate from every other sealed value. */
const SECRET_PURPOSE = 'oidc-client-secret';
const LOCALHOST = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;

export interface CreateOidcClientInput {
  clientId: string;
  redirectUris: string[];
  postLogoutRedirectUris?: string[];
  scopes?: string[];
  firstParty?: boolean;
  applicationId?: number;
  createdById?: number;
}

/** Client metadata as oidc-provider expects it (snake_case). */
export type ProviderClientMetadata = Record<string, unknown>;

@Injectable()
export class OidcClientService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authConfig: AuthConfigService,
    private readonly config: ConfigService,
  ) {}

  /** localhost redirect URIs are honoured only when this is explicitly on (never in production). */
  get allowLocalhostRedirects(): boolean {
    return this.config.get('OIDC_ALLOW_LOCALHOST_REDIRECTS') === 'true';
  }

  /**
   * Metadata for the provider's Client lookup, or undefined for unknown or
   * disabled clients. The secret is opened with the current key, then the
   * previous one (AUTH_TOKEN_KEY rotation).
   */
  async findMetadata(
    clientId: string,
  ): Promise<ProviderClientMetadata | undefined> {
    if (!clientId || typeof clientId !== 'string') return undefined;
    const client = await this.repository()
      .createQueryBuilder('client')
      .addSelect('client.clientSecretEnc')
      .leftJoinAndSelect('client.application', 'application')
      .where('client.client_id = :clientId', { clientId })
      .andWhere('client.status = :status', { status: OidcClientStatus.ACTIVE })
      .getOne();
    if (!client) return undefined;

    const secret = client.clientSecretEnc
      ? openSecretWithAny(
          this.secretKeys(),
          SECRET_PURPOSE,
          client.clientSecretEnc,
        )
      : null;
    if (client.tokenEndpointAuthMethod !== 'none' && !secret) return undefined;

    const keepRedirect = (uri: string) =>
      this.allowLocalhostRedirects || !LOCALHOST.test(uri);

    return {
      client_id: client.clientId,
      ...(secret ? { client_secret: secret } : {}),
      client_name: client.application?.name ?? client.clientId,
      redirect_uris: client.redirectUris.filter(keepRedirect),
      post_logout_redirect_uris:
        client.postLogoutRedirectUris.filter(keepRedirect),
      scope: client.allowedScopes.join(' '),
      token_endpoint_auth_method: client.tokenEndpointAuthMethod,
      grant_types: ['authorization_code'],
      response_types: ['code'],
      first_party: client.firstParty,
    };
  }

  /** Creates a confidential client; returns the secret, which is shown only this once. */
  async create(
    input: CreateOidcClientInput,
  ): Promise<{ clientId: string; clientSecret: string }> {
    const scopes = input.scopes?.length
      ? input.scopes
      : ['openid', 'email', 'profile'];
    const unsupported = scopes.filter((s) => !SUPPORTED_SCOPES.includes(s));
    if (!scopes.includes('openid') || unsupported.length) {
      throw new BadRequestException(
        `Invalid scopes: ${unsupported.join(', ') || 'openid is required'}`,
      );
    }
    for (const uri of [
      ...input.redirectUris,
      ...(input.postLogoutRedirectUris ?? []),
    ]) {
      this.assertRedirectUri(uri);
    }
    if (!input.redirectUris.length) {
      throw new BadRequestException('At least one redirect URI is required');
    }

    const clientSecret = this.newSecret();
    await this.repository().insert({
      clientId: input.clientId,
      applicationId: input.applicationId ?? null,
      clientSecretEnc: sealSecret(
        this.authConfig.authTokenKey,
        SECRET_PURPOSE,
        clientSecret,
      ),
      redirectUris: input.redirectUris,
      postLogoutRedirectUris: input.postLogoutRedirectUris ?? [],
      allowedScopes: scopes,
      tokenEndpointAuthMethod: 'client_secret_basic',
      firstParty: !!input.firstParty,
      createdById: input.createdById ?? null,
    });
    return { clientId: input.clientId, clientSecret };
  }

  /** A coordinated change: the client app must get the new secret at the same time. */
  async rotateSecret(clientId: string, updatedById?: number): Promise<string> {
    const clientSecret = this.newSecret();
    const result = await this.repository().update(
      { clientId },
      {
        clientSecretEnc: sealSecret(
          this.authConfig.authTokenKey,
          SECRET_PURPOSE,
          clientSecret,
        ),
        updatedById: updatedById ?? null,
      },
    );
    if (!result.affected) throw new BadRequestException('Unknown client');
    return clientSecret;
  }

  private assertRedirectUri(uri: string): void {
    let url: URL;
    try {
      url = new URL(uri);
    } catch {
      throw new BadRequestException(`Invalid redirect URI: ${uri}`);
    }
    const ok = url.protocol === 'https:' || LOCALHOST.test(uri);
    if (!ok || url.hash || url.username || url.password) {
      throw new BadRequestException(
        `Redirect URIs must be exact https URLs (or http://localhost): ${uri}`,
      );
    }
  }

  /** >= 256 bits. */
  private newSecret(): string {
    return randomBytes(32).toString('base64url');
  }

  private secretKeys(): Buffer[] {
    const keys = [this.authConfig.authTokenKey];
    const previous = this.config.get<string>('AUTH_TOKEN_KEY_PREVIOUS');
    if (previous) keys.push(Buffer.from(previous, 'base64'));
    return keys;
  }

  private repository() {
    return this.dataSource.getRepository(OidcClientEntity);
  }
}
