import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisService } from './RedisService';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 46379,
    }),
  ],
  providers: [RedisService],
  exports: [CacheModule, RedisService],
})
export class RedisModule {}
