import { Role } from '@app/entity/domain/user/type/Role';
import { applyDecorators } from '@nestjs/common';
import { AccessTokenGuard, Roles } from '.';

export function AdminGuard() {
  return applyDecorators(Roles([Role.Admin]), AccessTokenGuard());
}
