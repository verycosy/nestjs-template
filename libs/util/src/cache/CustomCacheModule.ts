import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { getCacheServiceProvider } from '.';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () =>
        process.env.NODE_ENV === 'test'
          ? undefined
          : {
              store: redisStore,
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
            },
    }),
  ],
  providers: [getCacheServiceProvider()],
  exports: [getCacheServiceProvider()],
})
export class CustomCacheModule {}
