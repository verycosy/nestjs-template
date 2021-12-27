import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../JwtPayload';
import { UserNotFoundError } from '../error/UserNotFoundError';

export const REFRESH_TOKEN_STRATEGY_NAME = 'refresh-token-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY_NAME,
) {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UserNotFoundError();
    }

    const refreshToken = req.headers['authorization'].split(' ')[1];
    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
