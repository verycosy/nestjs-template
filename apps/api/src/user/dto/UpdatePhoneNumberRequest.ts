import { IsString } from 'class-validator';

export class UpdatePhoneNumberRequest {
  @IsString()
  phoneNumber: string;
}
