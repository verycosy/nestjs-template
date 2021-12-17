import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthCodeIssuer {
  static EXPIRES_IN = 300; // 5min
  static VERIFIED = 'verified';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private getAuthCodeKey(emailOrPhoneNumber: string): string {
    return `auth-code:${emailOrPhoneNumber}`;
  }

  private getVerifiedKey(emailOrPhoneNumber: string) {
    return `verified:${emailOrPhoneNumber}`;
  }

  generate(): string {
    if (process.env.NODE_ENV === 'test') {
      return '123456';
    }

    const MIN = 100000;
    const MAX = 999999;

    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString();
  }

  async setAuthCodeTo(
    emailOrPhoneNumber: string,
    authCode: string,
  ): Promise<void> {
    const key = this.getAuthCodeKey(emailOrPhoneNumber);
    await this.cacheManager.set(key, authCode, {
      ttl: AuthCodeIssuer.EXPIRES_IN,
    });
  }

  async verifyAuthCodeVia(
    emailOrPhoneNumber: string,
    authCode: string,
  ): Promise<boolean> {
    const key = this.getAuthCodeKey(emailOrPhoneNumber);
    const correctAuthCode = await this.cacheManager.get(key);
    return correctAuthCode === authCode;
  }

  async setVerified(emailOrPhoneNumber: string): Promise<void> {
    const key = this.getVerifiedKey(emailOrPhoneNumber);
    await this.cacheManager.set(key, AuthCodeIssuer.VERIFIED, {
      ttl: AuthCodeIssuer.EXPIRES_IN,
    });
  }

  async isVerified(emailOrPhoneNumber: string): Promise<boolean> {
    const key = this.getVerifiedKey(emailOrPhoneNumber);
    const verified = await this.cacheManager.get(key);
    return verified === AuthCodeIssuer.VERIFIED;
  }

  async release(emailOrPhoneNumber: string): Promise<void> {
    const key = this.getVerifiedKey(emailOrPhoneNumber);
    await this.cacheManager.del(key);
  }
}
