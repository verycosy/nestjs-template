import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';

export class Verify {
  @IsEnum(Role)
  role: Role = Role.Customer;

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
