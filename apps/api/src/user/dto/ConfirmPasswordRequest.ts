import { ConfirmPassword } from './ConfirmPassword';

export class ConfirmPasswordRequest extends ConfirmPassword {
  static create(
    password: string,
    confirmPassword: string,
  ): ConfirmPasswordRequest {
    const dto = new ConfirmPasswordRequest();
    dto.password = password;
    dto.confirmPassword = confirmPassword;

    return dto;
  }
}
