import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { UserAdminQueryRepository } from '../../../../../apps/admin/src/user/UserAdminQueryRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersRequest } from '../../../src/user/dto/GetUsersRequest';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UserAdminQueryRepository', () => {
  let sut: UserAdminQueryRepository;
  let repository: Repository<User>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        TypeOrmTestModule,
        TypeOrmModule.forFeature([UserAdminQueryRepository]),
      ],
    }).compile();

    sut = module.get(UserAdminQueryRepository);
    repository = module.get('UserRepository');

    const users = await Promise.all(
      Array.from({ length: 11 }, (_, i) =>
        User.signUp({
          name: `tester${i}`,
          email: `test${i}@test.com`,
          phoneNumber: '',
          password: 'password',
        }),
      ),
    );

    await repository.save(users);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('paging', () => {
    it('paging 1', async () => {
      const [items, totalCount] = await sut.paging(
        GetUsersRequest.create(1, 10, Role.Customer),
      );
      expect(items[0].id).toBe(11);
      expect(totalCount).toBe(11);
    });

    it('paging 2', async () => {
      const [items, totalCount] = await sut.paging(
        GetUsersRequest.create(2, 10, Role.Customer),
      );
      expect(items[0].id).toBe(1);
      expect(totalCount).toBe(11);
    });
  });
});
