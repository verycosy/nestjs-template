import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { AuthCodeIssuer, AuthCodeService } from '.';
import { getCacheServiceProvider } from '../cache';
import { getEmailServiceProvider } from '../email';
import { getSmsServiceProvider } from '../sms';

@Module({
  imports: [
    CacheModule.register(
      process.env.NODE_ENV === 'test'
        ? undefined
        : {
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
          },
    ),
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
