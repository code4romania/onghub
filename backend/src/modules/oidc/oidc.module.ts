import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider as NestProvider,
} from '@nestjs/common';
import { InteractionController } from './controllers/interaction.controller';
import {
  OIDC_ACCOUNT_SOURCE,
  OIDC_OPTIONS,
  OIDC_PROVIDER,
} from './oidc.constants';
import { OidcOptions, oidcOptionsFromEnv } from './oidc.options';
import { OidcAccountSource } from './oidc-account-source.interface';
import { createOidcProvider } from './oidc.provider-factory';

export interface OidcModuleOptions {
  imports?: ModuleMetadata['imports'];
  /** Provider for OIDC_ACCOUNT_SOURCE. */
  accountSource: NestProvider;
  /** Defaults to the environment. `null` disables the feature. */
  options?: OidcOptions | null;
}

@Module({})
export class OidcModule {
  static register(config: OidcModuleOptions): DynamicModule {
    return {
      module: OidcModule,
      imports: config.imports ?? [],
      controllers: [InteractionController],
      providers: [
        config.accountSource,
        {
          provide: OIDC_OPTIONS,
          useFactory: () =>
            config.options === undefined
              ? oidcOptionsFromEnv() ?? null
              : config.options,
        },
        {
          provide: OIDC_PROVIDER,
          inject: [OIDC_OPTIONS, OIDC_ACCOUNT_SOURCE],
          useFactory: (
            options: OidcOptions | null,
            accounts: OidcAccountSource,
          ) => (options ? createOidcProvider(options, accounts) : null),
        },
      ],
      exports: [OIDC_PROVIDER],
    };
  }
}
