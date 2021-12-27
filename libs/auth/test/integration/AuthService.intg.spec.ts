import { AuthService } from '../../src/AuthService';
import { User } from '../../../entity/src/domain/user/User.entity';
import { UserModule } from '../../../entity/src/domain/user/UserModule';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../entity/test/typeorm.test.module';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let sut: AuthService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        getTypeOrmTestModule(),
        JwtModule.register({}),
        UserModule,
      ],
      providers: [AuthService],
    }).compile();

    sut = module.get(AuthService);
    userRepository = module.get('UserRepository');
  });

  afterAll(async () => {
    await userRepository.clear();
  });

  it('sign up', async () => {
    const signUpUser = await User.signUp({
      name: 'verycosy',
      email: 'test@test.com',
      password: 'password',
      phoneNumber: '010-1111-2222',
    });

    const newUser = await sut.signUp(signUpUser);
    expect(newUser.email).toEqual(signUpUser.email);
  });
});
