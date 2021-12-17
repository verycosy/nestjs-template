import { AuthCode } from '@app/util/auth-code/AuthCode';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class SendAuthCode {
  @IsString()
  phoneNumber: string;
}

export class VerifyAuthCode {
  @IsString()
  phoneNumber: string;

  @Transform(({ value }) => new AuthCode(value))
  authCode: AuthCode;
}
