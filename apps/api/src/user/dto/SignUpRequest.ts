import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { IsEnum, IsString, Length } from 'class-validator';
import { ConfirmPasswordRequest } from './ConfirmPasswordRequest';

export class SignUpRequest extends ConfirmPasswordRequest {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @Length(13, 13)
  phoneNumber: string;

  async toEntity(): Promise<User> {
    return await User.signUp({
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
    });
  }
}
