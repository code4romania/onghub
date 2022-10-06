import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { OrganizationRequestHistorySubscriber } from 'src/modules/organization/entities/subscribers/organization-request-history.subscriber';
import { ApplicationHistorySubscriber } from 'src/modules/application/entities/subscribers/application-history.subscriber';
import { ApplicationRequestHistorySubscriber } from 'src/modules/application/entities/subscribers/application-request-history.subscriber';
import { UserHistorySubscriber } from 'src/modules/user/entities/subscribers/user-history.subscriber';
import { OrganizationHistorySubscriber } from 'src/modules/organization/entities/subscribers/organization-history.subscriber';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: +this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      autoLoadEntities: true,
      synchronize: false, // never set it to TRUE in production
      subscribers: [
        OrganizationHistorySubscriber,
        OrganizationRequestHistorySubscriber,
        ApplicationHistorySubscriber,
        ApplicationRequestHistorySubscriber,
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
