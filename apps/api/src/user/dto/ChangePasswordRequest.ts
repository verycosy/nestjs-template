import { IsString } from 'class-validator';
import { ConfirmPassword } from './ConfirmPassword';

export class ChangePasswordRequest extends ConfirmPassword {
  @IsString()
  oldPassword: string;

  static create(
    oldPassword: string,
    password: string,
    confirmPassword: string,
  ): ChangePasswordRequest {
    const dto = new ChangePasswordRequest();
    dto.oldPassword = oldPassword;
    dto.password = password;
    dto.confirmPassword = confirmPassword;

    return dto;
  }
}
