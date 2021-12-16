import { User } from '@app/entity/domain/user/User.entity';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async setAuthCodeTo(
    emailOrPhoneNumber: string,
    authCode: string,
  ): Promise<void> {
    await this.cacheManager.set(`auth-code:${emailOrPhoneNumber}`, authCode, {
      ttl: 300,
    });
  }

  async verifyAuthCodeVia(
    emailOrPhoneNumber: string,
    authCode: string,
  ): Promise<boolean> {
    const correctAuthCode = await this.cacheManager.get(
      `auth-code:${emailOrPhoneNumber}`,
    );
    return correctAuthCode === authCode;
  }

  async setVerified(emailOrPhoneNumber: string): Promise<void> {
    await this.cacheManager.set(`verified:${emailOrPhoneNumber}`, 'true', {
      ttl: 300,
    });
  }

  async isVerified(emailOrPhoneNumber: string): Promise<boolean> {
    const verified = await this.cacheManager.get(
      `verified:${emailOrPhoneNumber}`,
    );
    return verified === 'true';
  }

  async signUp(newUser: User): Promise<User> {
    return await this.userRepository.save(newUser);
  }
}
