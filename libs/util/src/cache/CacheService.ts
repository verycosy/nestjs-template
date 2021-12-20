import { CachingConfig } from 'cache-manager';

export const CACHE_SERVICE = Symbol('CacheService');
export interface CacheService {
  get<T>(key: string): Promise<T>;
  set(key: string, value: string, options?: CachingConfig): Promise<void>;
  del(key: string): Promise<void>;
}
