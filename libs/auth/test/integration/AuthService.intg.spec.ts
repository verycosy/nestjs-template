import { AuthService } from '../../src/AuthService';
import { User } from '../../../entity/src/domain/user/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Repository } from 'typeorm';
import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';
import { UserAlreadyExistsError } from '@app/auth/error';

describe('AuthService', () => {
  let sut: AuthService;
  let module: TestingModule;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), TypeOrmTestModule, JwtModule.register({})],
      providers: [AuthService],
    }).compile();

    sut = module.get(AuthService);
    userRepository = module.get('UserRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  describe('sign up', () => {
    let signUpUser: User;

    beforeEach(async () => {
      signUpUser = await User.signUp({
        name: 'verycosy',
        email: 'test@test.com',
        password: 'password',
        phoneNumber: '010-1111-2222',
      });
    });

    it('이미 같은 이메일과 role로 가입된 user가 있으면 UserAlreadyExistsError를 던진다', async () => {
      await sut.signUp(signUpUser);

      try {
        await sut.signUp(signUpUser);
      } catch (err) {
        expect(err).toBeInstanceOf(UserAlreadyExistsError);
      }
    });

    it('회원가입이 성공하면 가입된 user 객체 반환', async () => {
      const newUser = await sut.signUp(signUpUser);

      expect(newUser.email).toEqual(signUpUser.email);
    });
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
      const result = await sut.checkEmailExists(email, Role.Customer);
      expect(result).toEqual(true);
    });

    it('가입되지 않았으면 false 반환', async () => {
      const result1 = await sut.checkEmailExists(
        'other@test.com',
        Role.Customer,
      );
      const result2 = await sut.checkEmailExists(email, Role.Creator);

      expect(result1).toEqual(false);
      expect(result2).toEqual(false);
    });
  });
});
