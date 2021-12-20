import { AuthCode } from '@app/util/auth-code/AuthCode';
import { AuthCodeIssuer } from '@app/util/auth-code/AuthCodeIssuer';
import { getCacheServiceProvider } from '@app/util/cache';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthCodeIssue', () => {
  let sut: AuthCodeIssuer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [AuthCodeIssuer, getCacheServiceProvider()],
    }).compile();

    sut = module.get(AuthCodeIssuer);
  });

  describe('verifyAuthCodeVia', () => {
    const phoneNumber = '010-1111-2222';

    it('인증코드가 일치하지 않으면 false 반환', async () => {
      await sut.setAuthCodeTo(phoneNumber, new AuthCode('000000'));
      expect(
        await sut.verifyAuthCodeVia(phoneNumber, new AuthCode('123456')),
      ).toEqual(false);
    });

    it('인증코드가 일치하면 true 반환', async () => {
      await sut.setAuthCodeTo(phoneNumber, new AuthCode('123456'));
      expect(
        await sut.verifyAuthCodeVia(phoneNumber, new AuthCode('123456')),
      ).toEqual(true);
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

  it('release', async () => {
    const phoneNumber = '010-1111-2222';

    await sut.setVerified(phoneNumber);
    await sut.release(phoneNumber);
    expect(await sut.isVerified(phoneNumber)).toEqual(false);
  });

  it('checkAuthCodeTrialLimit', async () => {
    const phoneNumber = '010-1111-2222';

    try {
      expect(await sut.checkAuthCodeTrialLimit(phoneNumber)).toEqual(1);
      expect(await sut.checkAuthCodeTrialLimit(phoneNumber)).toEqual(2);
      expect(await sut.checkAuthCodeTrialLimit(phoneNumber)).toEqual(3);
      expect(await sut.checkAuthCodeTrialLimit(phoneNumber)).toEqual(4);
      expect(await sut.checkAuthCodeTrialLimit(phoneNumber)).toEqual(5);
      await sut.checkAuthCodeTrialLimit(phoneNumber);
    } catch (err) {
      expect(err.message).toEqual('Exceeded trial limit, try after 1 hour');
    }
  });
});
