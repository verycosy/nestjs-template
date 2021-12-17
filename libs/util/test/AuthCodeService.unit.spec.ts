import { AuthCodeModule, AuthCodeService } from '@app/util/auth-code';
import { AuthCode } from '@app/util/auth-code/AuthCode';
import { EMAIL_SERVICE, MockEmailService } from '@app/util/email';
import { MockSmsService } from '@app/util/sms/MockSmsService';
import { SMS_SERVICE } from '@app/util/sms/SmsService';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthCodeService', () => {
  let sut: AuthCodeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthCodeModule],
    })
      .overrideProvider(SMS_SERVICE)
      .useClass(MockSmsService)
      .overrideProvider(EMAIL_SERVICE)
      .useClass(MockEmailService)
      .compile();

    sut = module.get(AuthCodeService);
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
    expect(await sut.isVerified(phoneNumber)).toEqual(true);
    expect(await sut.isVerified(phoneNumber)).toEqual(false);
  });
});
