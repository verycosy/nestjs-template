import { CacheModule, Module, Provider } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { CACHE_SERVICE } from './CacheService';
import { MockCacheService } from './MockCacheService';
import { RedisService } from './RedisService';

const cacheServiceProvider: Provider = {
  provide: CACHE_SERVICE,
  useClass: process.env.NODE_ENV === 'test' ? MockCacheService : RedisService,
};

@Module({
  imports: [
    CacheModule.register(
      process.env.NODE_ENV === 'test'
        ? undefined
        : {
            store: redisStore,
            host: 'localhost',
            port: 46379,
          },
    ),
  ],
  providers: [cacheServiceProvider],
  exports: [cacheServiceProvider],
})
export class RedisModule {}
