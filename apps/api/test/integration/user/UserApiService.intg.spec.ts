import { ConfigModule } from '@nestjs/config';
import { User } from '@app/entity/domain/user/User.entity';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Test, TestingModule } from '@nestjs/testing';
import { UserApiService } from '../../../src/user/UserApiService';
import { Repository } from 'typeorm';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';

describe('UserApiService', () => {
  let sut: UserApiService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), getTypeOrmTestModule(), UserModule],
      providers: [UserApiService],
    }).compile();

    sut = module.get(UserApiService);
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
    });

    const newUser = await sut.signUp(signUpUser);
    expect(newUser.email).toEqual(signUpUser.email);
  });
});
