import { getConfigModule, getLoggerOptions } from '@app/config';
import { UserModule } from '@app/entity/domain/user/UserModule';
import {
  TestLikeFactory,
  TestProductFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import {
  UserApiController,
  UserApiService,
} from '../../../../../apps/api/src/user';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { CategoryModule } from '@app/entity/domain/category';
import { AuthCodeModule } from '@app/util/auth-code';
import { WinstonModule } from 'nest-winston';

describe('UserApiController', () => {
  let sut: UserApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        WinstonModule.forRoot(getLoggerOptions()),
        UserModule,
        AuthCodeModule,
        ProductModule,
        CategoryModule,
      ],
      controllers: [UserApiController],
      providers: [UserApiService],
    }).compile();

    sut = module.get(UserApiController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('getLikedProducts', async () => {
    const user = await TestUserFactory.create(module);
    const subCategory = await TestSubCategoryFactory.create(module);
    const product = await TestProductFactory.create(module, subCategory);
    await TestLikeFactory.create(module, user, product);

    const result = await sut.getLikedProducts(user);

    expect(result).toEqual([
      {
        id: 1,
        name: 'banana',
        price: 1000,
        status: 'Sell',
      },
    ]);
  });
});
