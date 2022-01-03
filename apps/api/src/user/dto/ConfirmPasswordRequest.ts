import { IsString } from 'class-validator';

export class ConfirmPasswordRequest {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  checkEqualPassword(): void {
    if (this.password !== this.confirmPassword) {
      throw new Error('Password does not matched');
    }
  }
}
