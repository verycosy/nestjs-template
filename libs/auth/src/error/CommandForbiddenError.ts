import { User } from '@app/entity/domain/user/User.entity';

export class CommandForbiddenError extends Error {
  constructor(user: User, command: string) {
    super(`user#${user.id} tried ${command}`);
  }
}
