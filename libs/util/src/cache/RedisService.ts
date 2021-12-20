import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';
import { CacheService } from './CacheService';

@Injectable()
export class RedisService implements CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  async set(
    key: string,
    value: string,
    options?: CachingConfig,
  ): Promise<void> {
    await this.cacheManager.set(key, value, options);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
