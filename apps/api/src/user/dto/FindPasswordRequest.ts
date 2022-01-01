import { IsString } from 'class-validator';

export class Verify {
  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;
}

export class ChangePassword {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  isEqualPassword(): boolean {
    return this.password === this.confirmPassword;
  }
}
