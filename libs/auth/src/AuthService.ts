import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken, JwtPayload } from './interface';
import { WrongPasswordError, UserNotFoundError } from './error';

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

  async signUp(newUser: User): Promise<User> {
    return await this.userRepository.save(newUser);
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

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!(await user.validatePassword(plainTextPassword))) {
      throw new WrongPasswordError();
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

  async refresh(user: User): Promise<AuthToken> {
    const jwtTokens = await this.generateJwtTokens({ id: user.id });
    await this.setRefreshToken(user, jwtTokens.refreshToken);

    return jwtTokens;
  }

  async changePassword(
    user: User,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (await user.validatePassword(oldPassword)) {
      await user.changePassword(newPassword);
      await this.userRepository.save(user);
      return;
    }

    throw new WrongPasswordError();
  }
}
