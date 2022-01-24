import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';

interface CreateParam {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

export class TestUserFactory {
  static async create(
    module: TestingModule,
    param: CreateParam = {
      name: 'tester',
      email: 'test@test.com',
      password: 'password',
      phoneNumber: '010-1111-2222',
      role: Role.Customer,
    },
  ): Promise<User> {
    const user = await User.signUp(param);
    return await module.get('UserRepository').save(user);
  }
}
