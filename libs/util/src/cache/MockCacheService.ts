import { Injectable } from '@nestjs/common';
import { CachingConfig } from 'cache-manager';
import { CacheService } from './CacheService';

@Injectable()
export class MockCacheService implements CacheService {
  private readonly memory: Record<string, any> = {};

  get<T>(key: string): Promise<T> {
    return Promise.resolve(this.memory[key]);
  }

  set(key: string, value: string, options?: CachingConfig): Promise<void> {
    this.memory[key] = value;
    return;
  }

  del(key: string): Promise<void> {
    delete this.memory[key];
    return;
  }
}
