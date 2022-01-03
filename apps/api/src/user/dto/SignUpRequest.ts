import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { IsEnum, IsString, Length } from 'class-validator';

export class SignUpRequest {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  @Length(13, 13)
  phoneNumber: string;

  isEqualPassword(): boolean {
    return this.password === this.confirmPassword;
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
