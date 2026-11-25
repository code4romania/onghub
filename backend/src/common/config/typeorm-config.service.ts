import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { OrganizationRequestHistorySubscriber } from 'src/modules/organization/entities/subscribers/organization-request-history.subscriber';
import { ApplicationHistorySubscriber } from 'src/modules/application/entities/subscribers/application-history.subscriber';
import { UserHistorySubscriber } from 'src/modules/user/entities/subscribers/user-history.subscriber';
import { OrganizationHistorySubscriber } from 'src/modules/organization/entities/subscribers/organization-history.subscriber';
import { OngApplicationHistorySubscriber } from 'src/modules/application/entities/subscribers/ong-application-history.subscriber';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Default (unset) keeps running migrations on boot. The e2e harness
    // migrates from src itself and sets this to `false`.
    const runMigrations =
      this.configService.get('TYPEORM_MIGRATIONS_RUN') !== 'false';

    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: +this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      migrations: runMigrations ? ['dist/migrations/*.js'] : [],
      autoLoadEntities: true,
      // uuid PKs default to gen_random_uuid() (built in since Postgres 13):
      // no uuid-ossp extension needed. Auth tables are the first uuid columns.
      uuidExtension: 'pgcrypto',
      migrationsRun: runMigrations,
      synchronize: false, // never set it to TRUE in production
      subscribers: [
        OrganizationHistorySubscriber,
        OrganizationRequestHistorySubscriber,
        ApplicationHistorySubscriber,
        OngApplicationHistorySubscriber,
        UserHistorySubscriber,
      ],
      logging: !!parseInt(this.configService.get('TYPEORM_DEBUG'))
        ? true
        : false,
      ssl:
        this.configService.get('NODE_ENV') === 'local'
          ? false
          : {
              rejectUnauthorized: false,
            },
    };
  }
}
