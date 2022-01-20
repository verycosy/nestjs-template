import { AuthCode, AuthCodeApiProperty } from '@app/util/auth-code/AuthCode';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class SendAuthCode {
  @IsString()
  phoneNumber: string;

  static create(phoneNumber: string): SendAuthCode {
    const dto = new SendAuthCode();
    dto.phoneNumber = phoneNumber;

    return dto;
  }
}

export class VerifyAuthCode {
  @IsString()
  phoneNumber: string;

  @AuthCodeApiProperty()
  @Transform(({ value }) => new AuthCode(value))
  authCode: AuthCode;

  static create(phoneNumber: string, authCode: AuthCode): VerifyAuthCode {
    const dto = new VerifyAuthCode();
    dto.phoneNumber = phoneNumber;
    dto.authCode = authCode;

    return dto;
  }
}
