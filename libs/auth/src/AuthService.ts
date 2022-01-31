import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken, JwtPayload } from './interface';
import {
  WrongPasswordError,
  UserNotFoundError,
  UserAlreadyExistsError,
} from './error';
import { Role } from '@app/entity/domain/user/type/Role';
import { LoginDto } from '.';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async generateJwtTokens(payload: JwtPayload): Promise<AuthToken> {
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
    const user = await this.userRepository.findOne({
      email: newUser.email,
      role: newUser.role,
    });

    if (user) {
      throw new UserAlreadyExistsError();
    }

    return await this.userRepository.save(newUser);
  }

  async setRefreshToken(user: User, refreshToken: string): Promise<void> {
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }

  async login(
    email: string,
    plainTextPassword: string,
    role: Role = Role.Customer,
  ): Promise<LoginDto> {
    const user = await this.userRepository.findOne({ email, role });

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!(await user.validatePassword(plainTextPassword))) {
      throw new WrongPasswordError();
    }

    const jwtTokens = await this.generateJwtTokens({ id: user.id });
    await this.setRefreshToken(user, jwtTokens.refreshToken);

    return new LoginDto(user, jwtTokens);
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

  async checkEmailExists(
    email: string,
    role: Role = Role.Customer,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ email, role });
    return Boolean(user);
  }
}
