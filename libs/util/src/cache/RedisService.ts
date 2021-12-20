import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

declare module 'cache-manager' {
  interface Store {
    getClient: () => Redis;
  }
}

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.client = this.cacheManager.store.getClient();
  }
}
