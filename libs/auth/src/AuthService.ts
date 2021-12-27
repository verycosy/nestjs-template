import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from './AuthToken';
import { UserNotFoundError } from './error/UserNotFoundError';
import { JwtPayload } from './JwtPayload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async generateJwtTokens(payload: JwtPayload): Promise<AuthToken> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}s`,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}s`,
    });

    return { accessToken, refreshToken };
  }

  async setRefreshToken(user: User, refreshToken: string): Promise<void> {
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }

  async login(
    email: string,
    plainTextPassword: string,
  ): Promise<{ user: User } & AuthToken> {
    const user = await this.userRepository.findOne({ email });

    if (!user || !(await user.validatePassword(plainTextPassword))) {
      throw new UserNotFoundError();
    }

    const jwtTokens = await this.generateJwtTokens({ id: user.id });
    await this.setRefreshToken(user, jwtTokens.refreshToken);

    return {
      user,
      ...jwtTokens,
    };
  }

  async logout(user: User): Promise<void> {
    user.refreshToken = null;
    await this.userRepository.save(user);
  }
}
