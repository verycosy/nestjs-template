import { createLogger } from 'winston';
import { AuthCodeIssuer, AuthCodeService } from '@app/util/auth-code';
import { AuthCode } from '@app/util/auth-code/AuthCode';
import { MockCacheService } from '@app/util/cache';
import { MockEmailService } from '@app/util/email';
import { MockSmsService } from '@app/util/sms';
import { getLoggerOptions } from '@app/config';
import { NotVerifiedError } from '@app/util/auth-code/error';

describe('AuthCodeService', () => {
  let sut: AuthCodeService;

  beforeAll(async () => {
    sut = new AuthCodeService(
      new AuthCodeIssuer(new MockCacheService()),
      new MockSmsService(),
      new MockEmailService(),
      createLogger(getLoggerOptions()),
    );
  });

  it('인증코드가 일치하는지 확인', async () => {
    const phoneNumber = '010-1111-2222';

    await sut.sendViaSms(phoneNumber);
    expect(await sut.verify(phoneNumber, new AuthCode('000000'))).toEqual(
      false,
    );
    expect(await sut.verify('010-3333-4444', new AuthCode('123456'))).toEqual(
      false,
    );
    expect(await sut.verify(phoneNumber, new AuthCode('123456'))).toEqual(true);
  });

  it('인증여부 확인 후 인증 해제되는지 확인', async () => {
    const phoneNumber = '010-1111-2222';

    await sut.sendViaSms(phoneNumber);
    expect(await sut.verify(phoneNumber, new AuthCode('123456'))).toEqual(true);
    expect(await sut.checkVerified(phoneNumber)).toBeUndefined();
    expect(sut.checkVerified(phoneNumber)).rejects.toThrow(
      new NotVerifiedError(phoneNumber),
    );
  });
});
