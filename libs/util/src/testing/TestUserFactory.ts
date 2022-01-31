import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';

interface CreateParam {
  email?: string;
  name?: string;
  phoneNumber?: string;
  password?: string;
  role?: Role;
}

export class TestUserFactory {
  static async create(
    module: TestingModule,
    param: CreateParam = {},
  ): Promise<User> {
    const {
      email = 'test@test.com',
      name = 'tester',
      phoneNumber = '010-1111-2222',
      password = 'password',
      role = Role.Customer,
    } = param;

    const user = await User.signUp({
      email,
      name,
      phoneNumber,
      password,
      role,
    });
    return await module.get('UserRepository').save(user);
  }
}
