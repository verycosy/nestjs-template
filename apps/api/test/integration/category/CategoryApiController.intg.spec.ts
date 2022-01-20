import { getConfigModule } from '@app/config';
import { Category, CategoryModule } from '@app/entity/domain/category';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryApiController } from '../../../src/category/controller/CategoryApiController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { Repository } from 'typeorm';
import { ProductModule } from '@app/entity/domain/product/ProductModule';

describe('CategoryApiController', () => {
  let module: TestingModule;
  let sut: CategoryApiController;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        CategoryModule,
        ProductModule,
      ],
      controllers: [CategoryApiController],
    }).compile();

    sut = module.get(CategoryApiController);
    categoryRepository = module.get('CategoryRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  it('findCategories', async () => {
    const category1 = new Category('fruit');
    category1.addSubCategory('apple');

    const category2 = new Category('vehicle');
    category2.addSubCategory('car');

    await categoryRepository.save([category1, category2]);

    const result = await sut.findCategories();

    expect(result.data).toEqual([category1, category2]);
  });
});
