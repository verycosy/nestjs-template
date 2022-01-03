import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';

export class CheckEmailExistsRequest {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  email: string;
}
