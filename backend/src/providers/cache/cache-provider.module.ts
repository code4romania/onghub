import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService } from 'src/common/config/cache-config.service';
import { TypeOrmConfigService } from 'src/common/config/typeorm-config.service';

/**
 * Will register the CacheModule using the provided configuration
 *
 * @isGLobal set as global. Imported once in AppModule and can be used in any place of the app
 *
 * Configure .env variables for the Redis store and TTL
 *
 * @see [Caching](https://docs.nestjs.com/techniques/caching)
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
    }),
  ],
  exports: [CacheModule],
})
export class CacheProviderModule {}
