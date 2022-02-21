import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { GetUsersRequest } from '../../../../admin/src/user/dto';
import { UserAdminService } from '../../../../../apps/admin/src/user/UserAdminService';
import { UserAdminModule } from '../../../../../apps/admin/src/user/UserAdminModule';

describe('UserAdminService', () => {
  let module: TestingModule;
  let sut: UserAdminService;
  let repository: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), UserAdminModule],
    }).compile();

    sut = module.get(UserAdminService);
    repository = module.get('UserRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  it('Role 기준으로 사용자 목록 페이징', async () => {
    await repository.save(
      await User.signUp({
        name: 'tester',
        email: 'test@test.com',
        password: 'password',
        phoneNumber: '010-1111-2222',
      }),
    );

    const result = await sut.getUsersByRole(
      GetUsersRequest.create(1, 10, Role.Customer),
    );

    expect(result.pageSize).toBe(10);
    expect(result.totalCount).toBe(1);
    expect(result.totalPage).toBe(1);
    expect(result.items.length).toBe(1);
    expect(result.items[0]).toEqual({
      id: 1,
      name: 'tester',
      email: 'test@test.com',
      phoneNumber: '010-1111-2222',
    });
  });
});
