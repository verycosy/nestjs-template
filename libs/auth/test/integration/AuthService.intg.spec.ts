import { AuthService } from '../../src/AuthService';
import { User } from '../../../entity/src/domain/user/User.entity';
import { UserModule } from '../../../entity/src/domain/user/UserModule';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../entity/test/typeorm.test.module';
import { Repository } from 'typeorm';
import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';

describe('AuthService', () => {
  let sut: AuthService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getConfigModule(),
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

  describe('checkEmailExists', () => {
    const email = 'test@test.com';

    beforeEach(async () => {
      const user = await User.signUp({
        name: 'verycosy',
        email,
        password: 'password',
        phoneNumber: '010-1111-2222',
      });
      await userRepository.save(user);
    });

    it('이미 가입 됐으면 true 반환', async () => {
      expect(sut.checkEmailExists(email, Role.Customer)).resolves.toEqual(true);
    });

    it('가입되지 않았으면 false 반환', async () => {
      expect(
        sut.checkEmailExists('other@test.com', Role.Customer),
      ).resolves.toEqual(false);
      expect(sut.checkEmailExists(email, Role.Creator)).resolves.toEqual(false);
    });
  });
});
