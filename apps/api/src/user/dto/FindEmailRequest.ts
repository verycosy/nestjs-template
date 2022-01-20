import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum, IsString } from 'class-validator';

export class FindEmailRequest {
  @IsEnum(Role)
  role: Role = Role.Customer;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  static create(
    role: Role,
    name: string,
    phoneNumber: string,
  ): FindEmailRequest {
    const dto = new FindEmailRequest();
    dto.role = role;
    dto.name = name;
    dto.phoneNumber = phoneNumber;

    return dto;
  }
}
