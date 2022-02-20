import { getConfigModule } from '@app/config';
import { User } from '@app/entity/domain/user/User.entity';
import {
  TestProductFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ProductApiService } from '../../../../../apps/api/src/product';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';

describe('ProductApiService', () => {
  let sut: ProductApiService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), TypeOrmTestModule],
      providers: [ProductApiService],
    }).compile();

    sut = module.get(ProductApiService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('like', () => {
    it('찜할 상품이 없으면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);

      const actual = () => sut.like(1, user);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('상품이 찜목록에 추가되고, 찜한 상품을 반환한다', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      await TestProductFactory.create(module, subCategory);

      const result = await sut.like(1, user);

      expect(result).toBe((await user.liked)[0]);
    });

    it('이미 같은 상품을 찜했으면 찜목록에 추가되지 않는다', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      await TestProductFactory.create(module, subCategory);

      await sut.like(1, user);
      await sut.like(1, user);
      await sut.like(1, user);

      const result = await module
        .get<Repository<User>>('UserRepository')
        .findOne({ id: 1 });

      expect((await result.liked).length).toBe(1);
    });
  });

  it('cancelLike', async () => {
    const user = await TestUserFactory.create(module);
    const subCategory = await TestSubCategoryFactory.create(module);
    await TestProductFactory.create(module, subCategory);
    await sut.like(1, user);

    await sut.cancelLike(1, user);

    expect((await user.liked).length).toBe(0);
  });
});
