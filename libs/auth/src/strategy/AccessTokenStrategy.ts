import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interface/JwtPayload';

export const ACCESS_TOKEN_STRATEGY_NAME = 'access-token-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_NAME,
) {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    return await this.userRepository.findOneOrFail({ id });
  }
}
