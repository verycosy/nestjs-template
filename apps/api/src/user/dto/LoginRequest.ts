import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';

export class LoginRequest {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  email: string;

  @IsString()
  password: string;

  static create(role: Role, email: string, password: string): LoginRequest {
    const dto = new LoginRequest();
    dto.role = role;
    dto.email = email;
    dto.password = password;

    return dto;
  }
}
