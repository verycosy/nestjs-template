import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 46379,
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
