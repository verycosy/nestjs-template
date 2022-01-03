import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';

export class LoginRequest {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
