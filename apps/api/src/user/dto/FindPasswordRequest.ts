import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';
import { ConfirmPassword } from './ConfirmPassword';

export class Verify {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  static create(role: Role, email: string, phoneNumber: string) {
    const dto = new Verify();
    dto.role = role;
    dto.email = email;
    dto.phoneNumber = phoneNumber;

    return dto;
  }
}

export class ChangePassword extends ConfirmPassword {
  static create(password: string, confirmPassword: string): ChangePassword {
    const dto = new ChangePassword();
    dto.password = password;
    dto.confirmPassword = confirmPassword;

    return dto;
  }
}
