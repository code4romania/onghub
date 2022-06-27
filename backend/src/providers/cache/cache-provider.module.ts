import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService } from 'src/common/config/cache-config.service';
import { TypeOrmConfigService } from 'src/common/config/typeorm-config.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
})
export class CacheProviderModule {}
