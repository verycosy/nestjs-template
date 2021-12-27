import { AuthService } from '../../src/AuthService';
import { User } from '../../../entity/src/domain/user/User.entity';
import { UserModule } from '../../../entity/src/domain/user/UserModule';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../entity/test/typeorm.test.module';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { PasswordNotMatchedError } from '@app/auth/error';

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

  describe('changePassword', () => {
    it('기존 비밀번호와 일치하지 않으면 PasswordNotMatchedError', async () => {
      const user = new User();
      const oldPassword = 'old password';
      await user.changePassword(oldPassword);

      expect(
        sut.changePassword(user, 'wrong old password', 'new password'),
      ).rejects.toThrowError(PasswordNotMatchedError);
    });

    it('새로운 비밀번호로 변경', async () => {
      const oldPassword = 'old password';
      const user = await User.signUp({
        name: 'verycosy',
        email: 'test@test.com',
        password: oldPassword,
        phoneNumber: '010-1111-2222',
      });

      await sut.changePassword(user, 'old password', 'new password');
      expect(user.validatePassword('new password')).resolves.toEqual(true);
    });
  });
});
