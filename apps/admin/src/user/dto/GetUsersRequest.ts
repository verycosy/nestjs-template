import { PageRequest } from '@app/config/PageRequest';
import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum } from 'class-validator';

export class GetUsersRequest extends PageRequest {
  @IsEnum(Role)
  role: Role;

  static create(pageNo: number, pageSize: number, role: Role) {
    const dto = new GetUsersRequest();
    dto.pageNo = pageNo;
    dto.pageSize = pageSize;
    dto.role = role;

    return dto;
  }
}
