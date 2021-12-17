import { AuthCodeIssuer, AuthCodeService } from '@app/util/auth-code';
import { EMAIL_SERVICE, MockEmailService } from '@app/util/email';
import { MockSmsService } from '@app/util/sms/MockSmsService';
import { SMS_SERVICE } from '@app/util/sms/SmsService';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthCodeService', () => {
  let sut: AuthCodeService;
  let authCodeIssuer: AuthCodeIssuer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        AuthCodeIssuer,
        {
          provide: SMS_SERVICE,
          useClass: MockSmsService,
        },
        {
          provide: EMAIL_SERVICE,
          useClass: MockEmailService,
        },
        AuthCodeService,
      ],
    }).compile();

    sut = module.get(AuthCodeService);
    authCodeIssuer = module.get(AuthCodeIssuer);

    jest.spyOn(authCodeIssuer, 'generate').mockImplementation(() => '123456');
  });

  it('인증코드가 일치하는지 확인', async () => {
    const phoneNumber = '010-1111-2222';

    await sut.sendViaSms(phoneNumber);
    expect(await sut.verify(phoneNumber, '000000')).toEqual(false);
    expect(await sut.verify('010-3333-4444', '123456')).toEqual(false);
    expect(await sut.verify(phoneNumber, '123456')).toEqual(true);
  });

  it('인증여부 확인 후 인증 해제되는지 확인', async () => {
    const phoneNumber = '010-1111-2222';

    await sut.sendViaSms(phoneNumber);
    expect(await sut.verify(phoneNumber, '123456')).toEqual(true);
    expect(await sut.isVerified(phoneNumber)).toEqual(true);
    expect(await sut.isVerified(phoneNumber)).toEqual(false);
  });
});
