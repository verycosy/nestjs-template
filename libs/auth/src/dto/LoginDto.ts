import { User } from '@app/entity/domain/user/User.entity';
import { AuthToken } from '../interface';

export class LoginDto {
  constructor(user: User, tokens: AuthToken) {
    this.user = user;
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }

  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
}
