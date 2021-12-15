import { User } from '@app/entity/domain/user/User.entity';
import { IsString } from 'class-validator';

export class SignUpRequest {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  isEqualPassword(): boolean {
    return this.password === this.confirmPassword;
  }

  async toEntity(): Promise<User> {
    return await User.signUp({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }
}
