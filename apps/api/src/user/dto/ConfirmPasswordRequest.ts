import { IsString } from 'class-validator';

export class ConfirmPasswordRequest {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  isEqualPassword(): boolean {
    return this.password === this.confirmPassword;
  }
}
