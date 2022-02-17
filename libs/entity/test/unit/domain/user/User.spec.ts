import { User } from '@app/entity/domain/user/User.entity';

describe('User', () => {
  describe('update', () => {
    let user: User;

    const newName = 'new tester';
    const newPhoneNumber = '010-3333-4444';

    beforeEach(async () => {
      user = await User.signUp({
        name: 'tester',
        email: 'tester@tester.com',
        phoneNumber: '010-1111-2222',
        password: 'password',
      });
    });

    it('비밀번호 제외하고 수정', async () => {
      await user.update(newName, newPhoneNumber);

      expect(user.name).toBe(newName);
      expect(user.phoneNumber).toBe(newPhoneNumber);
      expect(user.validatePassword('password')).resolves.toBe(true);
    });

    it('비밀번호까지 수정', async () => {
      await user.update(newName, newPhoneNumber, 'new password');

      expect(user.name).toBe(newName);
      expect(user.phoneNumber).toBe(newPhoneNumber);
      expect(user.validatePassword('new password')).resolves.toBe(true);
    });
  });
});
