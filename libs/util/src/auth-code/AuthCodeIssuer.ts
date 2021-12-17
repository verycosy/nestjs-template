import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AuthCode } from './AuthCode';

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

  async setAuthCodeTo(
    emailOrPhoneNumber: string,
    authCode: AuthCode,
  ): Promise<void> {
    const key = this.getAuthCodeKey(emailOrPhoneNumber);
    await this.cacheManager.set(key, authCode.get(), {
      ttl: AuthCodeIssuer.EXPIRES_IN,
    });
  }

  async verifyAuthCodeVia(
    emailOrPhoneNumber: string,
    authCode: AuthCode,
  ): Promise<boolean> {
    const key = this.getAuthCodeKey(emailOrPhoneNumber);
    const data = await this.cacheManager.get<string>(key);

    if (!data) {
      return false;
    }

    const correctAuthCode = new AuthCode(data);
    return authCode.equals(correctAuthCode);
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
