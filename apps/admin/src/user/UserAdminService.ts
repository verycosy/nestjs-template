import { Page } from '@app/config/Page';
import { UserQueryRepository } from '@app/entity/domain/user/UserQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersItem, GetUsersRequest } from './dto';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(UserQueryRepository)
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async getUsersByRole(query: GetUsersRequest) {
    const [items, totalCount] = await this.userQueryRepository.paging(query);

    return new Page<GetUsersItem>(
      totalCount,
      query.pageSize,
      items.map((user) => new GetUsersItem(user)),
    );
  }
}
