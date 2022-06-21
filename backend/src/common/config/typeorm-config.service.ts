import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

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
      synchronize: true, // never set it to TRUE in production
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
