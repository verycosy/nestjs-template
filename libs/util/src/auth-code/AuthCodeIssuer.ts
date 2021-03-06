import { Inject, Injectable } from '@nestjs/common';
import { CacheService, CACHE_SERVICE } from '../cache/CacheService';
import { AuthCode } from './AuthCode';
import { ExceedTrialLimitError } from './error';

@Injectable()
export class AuthCodeIssuer {
  static EXPIRES_IN = 60 * 5; // 5min
  static VERIFIED = 'verified';
  static TRIAL_COUNT_LIMIT = 5;
  static TRIAL_TIME_LIMIT = 60 * 60; // 1hour

  constructor(
    @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
  ) {}

  private getAuthCodeKey(emailOrPhoneNumber: string): string {
    return `auth-code:${emailOrPhoneNumber}`;
  }

  private getVerifiedKey(emailOrPhoneNumber: string) {
    return `verified:${emailOrPhoneNumber}`;
  }

  async checkAuthCodeTrialLimit(emailOrPhoneNumber: string): Promise<number> {
    const key = `trial:${emailOrPhoneNumber}`;
    const trial = Number((await this.cacheService.get(key)) ?? 0) + 1;

    if (AuthCodeIssuer.TRIAL_COUNT_LIMIT > trial - 1) {
      await this.cacheService.set(key, trial.toString(), {
        ttl: AuthCodeIssuer.TRIAL_TIME_LIMIT,
      });

      return trial;
    }

    throw new ExceedTrialLimitError();
  }

  async setAuthCodeTo(
    emailOrPhoneNumber: string,
    authCode: AuthCode,
  ): Promise<void> {
    const key = this.getAuthCodeKey(emailOrPhoneNumber);
    await this.cacheService.set(key, authCode.get(), {
      ttl: AuthCodeIssuer.EXPIRES_IN,
    });
  }

  async verifyAuthCodeVia(
    emailOrPhoneNumber: string,
    authCode: AuthCode,
  ): Promise<boolean> {
    const key = this.getAuthCodeKey(emailOrPhoneNumber);
    const data = await this.cacheService.get<string>(key);

    if (!data) {
      return false;
    }

    const correctAuthCode = new AuthCode(data);
    return authCode.equals(correctAuthCode);
  }

  async setVerified(emailOrPhoneNumber: string): Promise<void> {
    const key = this.getVerifiedKey(emailOrPhoneNumber);
    await this.cacheService.set(key, AuthCodeIssuer.VERIFIED, {
      ttl: AuthCodeIssuer.EXPIRES_IN,
    });
  }

  async isVerified(emailOrPhoneNumber: string): Promise<boolean> {
    const key = this.getVerifiedKey(emailOrPhoneNumber);
    const verified = await this.cacheService.get(key);
    return verified === AuthCodeIssuer.VERIFIED;
  }

  async release(emailOrPhoneNumber: string): Promise<void> {
    const key = this.getVerifiedKey(emailOrPhoneNumber);
    await this.cacheService.del(key);
  }
}
