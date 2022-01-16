import { getConfigModule } from '@app/config';
import { Test } from '@nestjs/testing';
import { CategoryAdminController } from '../../../src/category/controller/CategoryAdminController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { CategoryModule } from '@app/entity/domain/category/CategoryModule';
import {
  CreateCategoryRequest,
  CreateSubCategoryRequest,
} from '../../../src/category/dto';
import { Repository } from 'typeorm';
import { Category, SubCategory } from '@app/entity/domain/category';
import { ResponseEntity } from '@app/config/response';

describe('CategoryAdminController', () => {
  let sut: CategoryAdminController;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [getConfigModule(), getTypeOrmTestModule(), CategoryModule],
      controllers: [CategoryAdminController],
    }).compile();

    sut = module.get(CategoryAdminController);
    categoryRepository = module.get('CategoryRepository');
  });

  afterEach(async () => {
    await categoryRepository.manager.connection.close();
  });

  it('createCategory', async () => {
    const request = new CreateCategoryRequest();
    request.name = 'fruit';

    const result = await sut.createCategory(request);

    expect(result.data.name).toEqual('fruit');
  });

  describe('createSubCategory', () => {
    it('부모 카테고리가 없으면 Error Response Entity 반환', async () => {
      const request = new CreateSubCategoryRequest();
      request.name = 'apple';

      const result = await sut.createSubCategory(1, request);

      expect(result).toEqual(ResponseEntity.ERROR_WITH('Category Not Found'));
    });

    it('생성된 서브 카테고리 반환', async () => {
      await categoryRepository.save({ name: 'fruit' });
      const request = new CreateSubCategoryRequest();
      request.name = 'apple';

      const result = await sut.createSubCategory(1, request);
      const data = (result as ResponseEntity<SubCategory>).data;

      expect(data.id).toEqual(1);
      expect(data.name).toEqual('apple');
    });
  });
});
