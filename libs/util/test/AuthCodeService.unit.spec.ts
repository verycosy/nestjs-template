import { AuthCodeService } from '@app/util/auth-code';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthCodeService', () => {
  let sut: AuthCodeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [AuthCodeService],
    }).compile();

    sut = module.get(AuthCodeService);
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
});
