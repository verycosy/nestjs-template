import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { IsEnum, IsString, Length } from 'class-validator';
import { ConfirmPassword } from './ConfirmPassword';

export class SignUpRequest extends ConfirmPassword {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @Length(13, 13)
  phoneNumber: string;

  static create({
    role,
    name,
    email,
    phoneNumber,
    password,
    confirmPassword,
  }: SignUpRequestParams): SignUpRequest {
    const dto = new SignUpRequest();
    dto.role = role;
    dto.name = name;
    dto.email = email;
    dto.phoneNumber = phoneNumber;
    dto.password = password;
    dto.confirmPassword = confirmPassword;

    return dto;
  }

  async toEntity(): Promise<User> {
    return await User.signUp({
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
    });
  }
}

interface SignUpRequestParams {
  role?: Role;
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}
