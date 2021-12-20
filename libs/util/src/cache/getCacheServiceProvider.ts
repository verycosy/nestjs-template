import { Provider } from '@nestjs/common';
import { CACHE_SERVICE, MockCacheService, RedisService } from '.';

export function getCacheServiceProvider(): Provider {
  return {
    provide: CACHE_SERVICE,
    useClass: process.env.NODE_ENV === 'test' ? MockCacheService : RedisService,
  };
}
