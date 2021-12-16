import { User } from '@app/entity/domain/user/User.entity';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from '../../../src/user/SignUpService';
import { Repository } from 'typeorm';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';

describe('SignUpService', () => {
  let sut: SignUpService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserModule],
      providers: [SignUpService],
    }).compile();

    sut = module.get(SignUpService);
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
