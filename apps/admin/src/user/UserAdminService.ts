import { Page } from '@app/config/Page';
import { UserAdminQueryRepository } from './UserAdminQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersItem, GetUsersRequest } from './dto';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(UserAdminQueryRepository)
    private readonly userAdminQueryRepository: UserAdminQueryRepository,
  ) {}

  async getUsersByRole(query: GetUsersRequest) {
    const [items, totalCount] = await this.userAdminQueryRepository.paging(
      query,
    );

    return new Page<GetUsersItem>(
      totalCount,
      query.pageSize,
      items.map((user) => new GetUsersItem(user)),
    );
  }
}
