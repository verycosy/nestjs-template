import { IsString } from 'class-validator';

export class ChangePasswordRequest {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

  @IsString()
  confirmNewPassword: string;

  isEqualNewPassword(): boolean {
    return this.newPassword === this.confirmNewPassword;
  }
}
