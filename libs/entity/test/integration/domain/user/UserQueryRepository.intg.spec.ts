import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';
import { UserQueryRepository } from '@app/entity/domain/user/UserQueryRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetUsersRequest } from '../../../../../../apps/admin/src/user/dto/GetUsersRequest';
import { getTypeOrmTestModule } from '../../../../../../libs/entity/test/typeorm.test.module';
import { Repository } from 'typeorm';

describe('UserQueryRepository', () => {
  let sut: UserQueryRepository;
  let repository: Repository<User>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        TypeOrmModule.forFeature([User, UserQueryRepository]),
      ],
    }).compile();

    sut = module.get(UserQueryRepository);
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
