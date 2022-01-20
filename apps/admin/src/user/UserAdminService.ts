import { Page } from '@app/config/Page';
import { User } from '@app/entity/domain/user/User.entity';
import { UserQueryRepository } from '@app/entity/domain/user/UserQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUsersItem, GetUsersRequest } from './dto';
import { UpdateUserRequest } from './dto/UpdateUserRequest';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async updateUser(userId: number, body: UpdateUserRequest): Promise<User> {
    const { name, email, phoneNumber, password } = body;
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      return null;
    }

    await user.update(name, email, phoneNumber, password);
    return await this.userRepository.save(user);
  }
}
