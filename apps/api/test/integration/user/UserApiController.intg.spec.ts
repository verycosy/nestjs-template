import { getConfigModule, getLoggerOptions } from '@app/config';
import {
  TestLikeFactory,
  TestProductFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import {
  UserApiController,
  UserApiService,
} from '../../../../../apps/api/src/user';
import { AuthCodeModule } from '@app/util/auth-code';
import { WinstonModule } from 'nest-winston';

describe('UserApiController', () => {
  let sut: UserApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        TypeOrmTestModule,
        WinstonModule.forRoot(getLoggerOptions()),
        AuthCodeModule,
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
