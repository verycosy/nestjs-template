import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../JwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entity/domain/user/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token-jwt',
) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new Error(`User not found`);
    }

    return user;
  }
}
