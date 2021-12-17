import { IsString } from 'class-validator';

export class SendAuthCode {
  @IsString()
  phoneNumber: string;
}

export class VerifyAuthCode {
  @IsString()
  phoneNumber: string;

  @IsString()
  authCode: string;
}
