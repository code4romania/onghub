import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider as NestProvider,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InteractionController } from './controllers/interaction.controller';
import {
  OIDC_ACCOUNT_SOURCE,
  OIDC_OPTIONS,
  OIDC_PROVIDER,
} from './oidc.constants';
import { OidcOptions, oidcOptionsFromEnv } from './oidc.options';
import { OidcAccountSource } from './oidc-account-source.interface';
import { createOidcProvider } from './oidc.provider-factory';
import { OidcClientController } from './controllers/oidc-client.controller';
import { OidcClientService } from './services/oidc-client.service';
import { createPgAdapter } from './services/oidc-pg.adapter';
import { OidcCleanupService } from './services/oidc-cleanup.service';
import { journalProviderEvents } from './oidc.events';
import { AuthEventService } from 'src/modules/authentication/services/auth-event.service';

export interface OidcModuleOptions {
  imports?: ModuleMetadata['imports'];
  /** Provider for OIDC_ACCOUNT_SOURCE. */
  accountSource: NestProvider;
  /** Defaults to the environment. `null` disables the feature. */
  options?: OidcOptions | null;
  /**
   * Postgres storage and the oidc_client table (default). `false` keeps the
   * library's in-memory store, for tests that boot without a database.
   */
  persistence?: boolean;
}

@Module({})
export class OidcModule {
  static register(config: OidcModuleOptions): DynamicModule {
    const persistence = config.persistence !== false;
    return {
      module: OidcModule,
      imports: config.imports ?? [],
      controllers: [
        InteractionController,
        ...(persistence ? [OidcClientController] : []),
      ],
      providers: [
        config.accountSource,
        ...(persistence ? [OidcClientService, OidcCleanupService] : []),
        {
          provide: OIDC_OPTIONS,
          useFactory: () =>
            config.options === undefined
              ? oidcOptionsFromEnv() ?? null
              : config.options,
        },
        {
          provide: OIDC_PROVIDER,
          inject: [
            OIDC_OPTIONS,
            OIDC_ACCOUNT_SOURCE,
            { token: OidcClientService, optional: true },
            { token: DataSource, optional: true },
            { token: AuthEventService, optional: true },
          ],
          useFactory: (
            options: OidcOptions | null,
            accounts: OidcAccountSource,
            clients?: OidcClientService,
            dataSource?: DataSource,
            events?: AuthEventService,
          ) => {
            if (!options) return null;
            const provider = createOidcProvider(
              options,
              accounts,
              persistence && clients && dataSource
                ? (createPgAdapter(dataSource, clients) as any)
                : undefined,
            );
            if (events) journalProviderEvents(provider, events);
            return provider;
          },
        },
      ],
      exports: [OIDC_PROVIDER, ...(persistence ? [OidcClientService] : [])],
    };
  }
}
