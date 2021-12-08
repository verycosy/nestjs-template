import { User } from '@app/entity/domain/user/User.entity';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { UserApiService } from '../../../src/user/UserApiService';

describe('UserApiService', () => {
  let sut: UserApiService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserModule],
      providers: [UserApiService],
    }).compile();

    sut = module.get(UserApiService);
    userRepository = module.get('UserRepository');
  });

  afterAll(async () => {
    await userRepository.clear();
  });

  it('sayHello', () => {
    expect(sut.sayHello()).toEqual('hello');
  });

  it('sign up', async () => {
    const signUpUser = new User();
    signUpUser.email = 'test@test.com';
    signUpUser.password = 'password';

    const newUser = await sut.signUp(signUpUser);
    expect(newUser.email).toEqual(signUpUser.email);
  });
});
