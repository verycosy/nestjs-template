import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from './JwtPayload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, plainTextPassword: string) {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Error(`User not found`);
    }

    if (!(await user.validatePassword(plainTextPassword))) {
      throw new Error(`User not found`);
    }

    const payload: JwtPayload = {
      id: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}s`,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}s`,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
