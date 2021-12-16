import { User } from '@app/entity/domain/user/User.entity';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from '../../../src/user/SignUpService';
import { Repository } from 'typeorm';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { RedisModule } from '@app/util/cache';

describe('SignUpService', () => {
  let sut: SignUpService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserModule, RedisModule],
      providers: [SignUpService],
    }).compile();

    sut = module.get(SignUpService);
    userRepository = module.get('UserRepository');
  });

  afterAll(async () => {
    await userRepository.clear();
  });

  describe('verifyAuthCodeVia', () => {
    const phoneNumber = '010-1111-2222';

    it('인증코드가 일치하지 않으면 false 반환', async () => {
      await sut.setAuthCodeTo(phoneNumber, '0000');
      expect(await sut.verifyAuthCodeVia(phoneNumber, '1234')).toEqual(false);
    });

    it('인증코드가 일치하면 true 반환', async () => {
      await sut.setAuthCodeTo(phoneNumber, '1234');
      expect(await sut.verifyAuthCodeVia(phoneNumber, '1234')).toEqual(true);
    });
  });

  describe('isVerified', () => {
    const phoneNumber = '010-1111-2222';

    it('인증이 되지 않은 상태면 false 반환', async () => {
      expect(await sut.isVerified(phoneNumber)).toEqual(false);
    });

    it('인증이 된 상태면 true 반환', async () => {
      await sut.setVerified(phoneNumber);
      expect(await sut.isVerified(phoneNumber)).toEqual(true);
    });
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
