import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@app/entity/domain/user/User.entity';
import { Repository } from 'typeorm';
import * as passport from 'passport';
import { JwtPayload } from '../JwtPayload';
import { UserNotFoundError } from '../error/UserNotFoundError';

class JwtStrategy extends PassportStrategy(Strategy) {
  protected readonly userRepository: Repository<User>;

  constructor(secret: string, name: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    passport.use(name, this);
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}

export default JwtStrategy;
