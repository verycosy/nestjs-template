import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import {
  GetUsersRequest,
  UpdateUserRequest,
} from '../../../../admin/src/user/dto';
import { UserAdminService } from '../../../../../apps/admin/src/user/UserAdminService';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';

describe('UserAdminService', () => {
  let module: TestingModule;
  let sut: UserAdminService;
  let repository: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), TypeOrmTestModule],
      providers: [UserAdminService],
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

  it('사용자 정보 업데이트', async () => {
    await repository.save(
      await User.signUp({
        name: 'tester',
        email: 'test@test.com',
        password: 'password',
        phoneNumber: '010-1111-2222',
      }),
    );

    const result = await sut.updateUser(
      1,
      UpdateUserRequest.create('new', '010-3333-4444', 'new password'),
    );

    expect(result.name).toBe('new');
    expect(result.phoneNumber).toBe('010-3333-4444');
    expect(result.validatePassword('new password')).resolves.toBe(true);
  });
});
