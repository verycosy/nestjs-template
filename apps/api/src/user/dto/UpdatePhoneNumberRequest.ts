import { IsString } from 'class-validator';

export class UpdatePhoneNumberRequest {
  @IsString()
  phoneNumber: string;

  static create(phoneNumber: string): UpdatePhoneNumberRequest {
    const dto = new UpdatePhoneNumberRequest();
    dto.phoneNumber = phoneNumber;

    return dto;
  }
}
