import { WrongPasswordError } from '@app/auth/error';
import { User } from '@app/entity/domain/user/User.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getConfigModule } from '@app/config';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { UserService } from '@app/entity/domain/user/UserService';

describe('UserService', () => {
  let sut: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), UserModule],
    }).compile();

    sut = module.get(UserService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('changePassword', () => {
    it('기존 비밀번호와 일치하지 않으면 PasswordNotMatchedError', async () => {
      const user = new User();
      const oldPassword = 'old password';
      await user.changePassword(oldPassword);

      expect(
        sut.changePassword(user, 'wrong old password', 'new password'),
      ).rejects.toThrowError(WrongPasswordError);
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
