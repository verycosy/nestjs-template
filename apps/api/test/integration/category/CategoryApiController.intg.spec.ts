import { getConfigModule } from '@app/config';
import { Category, SubCategory } from '@app/entity/domain/category';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryApiController } from '../../../src/category/controller/CategoryApiController';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { Repository } from 'typeorm';

describe('CategoryApiController', () => {
  let module: TestingModule;
  let sut: CategoryApiController;
  let subCategoryRepository: Repository<SubCategory>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), TypeOrmTestModule],
      controllers: [CategoryApiController],
    }).compile();

    sut = module.get(CategoryApiController);
    subCategoryRepository = module.get('SubCategoryRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  it('findCategories', async () => {
    const category1 = new Category('fruit');
    const category2 = new Category('vehicle');

    await subCategoryRepository.save([
      SubCategory.create(category1, 'apple'),
      SubCategory.create(category2, 'car'),
    ]);

    const result = await sut.findCategories();

    expect(result.data).toEqual([
      {
        id: 1,
        name: 'fruit',
        subCategories: [
          {
            id: 1,
            name: 'apple',
          },
        ],
      },
      {
        id: 2,
        name: 'vehicle',
        subCategories: [
          {
            id: 2,
            name: 'car',
          },
        ],
      },
    ]);
  });
});
