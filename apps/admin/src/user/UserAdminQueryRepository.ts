import { GetUsersRequest } from 'apps/admin/src/user/dto';
import {
  AbstractRepository,
  createQueryBuilder,
  EntityRepository,
} from 'typeorm';
import { User } from '../../../../libs/entity/src/domain/user/User.entity';

@EntityRepository(User)
export class UserAdminQueryRepository extends AbstractRepository<User> {
  paging(param: GetUsersRequest): Promise<[User[], number]> {
    const queryBuilder = createQueryBuilder()
      .select(['user.id', 'user.name', 'user.email', 'user.phoneNumber'])
      .orderBy({
        id: 'DESC',
      })
      .from(User, 'user')
      .limit(param.getLimit())
      .offset(param.getOffset())
      .andWhere('user.role = :role', {
        role: param.role,
      });

    return queryBuilder.getManyAndCount();
  }
}
