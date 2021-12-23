import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { AuthCodeIssuer, AuthCodeService } from '.';
import { getCacheServiceProvider } from '../cache';
import { getEmailServiceProvider } from '../email';
import { getSmsServiceProvider } from '../sms';

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
  providers: [
    AuthCodeIssuer,
    AuthCodeService,
    getSmsServiceProvider(),
    getEmailServiceProvider(),
    getCacheServiceProvider(),
  ],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
