import { getConfigModule } from '@app/config';
import { Test } from '@nestjs/testing';
import { CategoryAdminController } from '../../../src/category/controller/CategoryAdminController';
import { CategoryModule } from '@app/entity/domain/category/CategoryModule';
import {
  CreateCategoryRequest,
  CreateSubCategoryRequest,
} from '../../../src/category/dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Category, SubCategory } from '@app/entity/domain/category';
import { ResponseEntity } from '@app/config/response';

describe('CategoryAdminController', () => {
  let sut: CategoryAdminController;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [getConfigModule(), CategoryModule],
      controllers: [CategoryAdminController],
    }).compile();

    sut = module.get(CategoryAdminController);
    categoryRepository = module.get('CategoryRepository');
  });

  afterEach(async () => {
    await categoryRepository.manager.connection.close();
  });

  it('createCategory', async () => {
    const request = CreateCategoryRequest.create('fruit');

    const result = await sut.createCategory(request);

    expect(result.data.name).toEqual('fruit');
  });

  describe('createSubCategory', () => {
    it('부모 카테고리가 없으면 EntityNotFoundError를 던진다', async () => {
      // given
      const request = CreateSubCategoryRequest.create('apple');

      // when
      const actual = () => sut.createSubCategory(1, request);

      // then
      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('생성된 서브 카테고리 반환', async () => {
      await categoryRepository.save(new Category('fruit'));
      const request = CreateSubCategoryRequest.create('apple');

      const result = await sut.createSubCategory(1, request);
      const data = (result as ResponseEntity<SubCategory>).data;

      expect(data.id).toEqual(1);
      expect(data.name).toEqual('apple');
    });
  });
});
