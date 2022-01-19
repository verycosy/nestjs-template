import { PageRequest } from '@app/config/PageRequest';
import { Role } from '@app/entity/domain/user/type/Role';
import { IsEnum } from 'class-validator';

export class GetUsersRequest extends PageRequest {
  @IsEnum(Role)
  role: Role;

  static create(pageNo: number, pageSize: number, role: Role) {
    const query = new GetUsersRequest();
    query.pageNo = pageNo;
    query.pageSize = pageSize;
    query.role = role;

    return query;
  }
}
