import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';
import { ConfirmPasswordRequest } from './ConfirmPasswordRequest';

export class Verify {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;
}

export class ChangePassword extends ConfirmPasswordRequest {}
