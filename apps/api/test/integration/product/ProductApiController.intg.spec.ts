import { getConfigModule } from '@app/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import {
  ProductApiController,
  ProductApiService,
  GetProductsRequest,
} from '../../../../../apps/api/src/product';
import { ProductAdminService } from '../../../../admin/src/product/ProductAdminService';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ResponseStatus } from '@app/config/response';
import {
  Category,
  CategoryModule,
  SubCategory,
} from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import { UserModule } from '@app/entity/domain/user/UserModule';
import {
  TestProductFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';

describe('ProductApiController', () => {
  let sut: ProductApiController;
  let module: TestingModule;
  let subCategoryRepository: Repository<SubCategory>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        CategoryModule,
        ProductModule,
        UserModule,
      ],
      providers: [ProductAdminService, ProductApiService],
      controllers: [ProductApiController],
    }).compile();

    sut = module.get(ProductApiController);
    subCategoryRepository = module.get('SubCategoryRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  describe('findProduct', () => {
    it('상품이 없으면 Error Response Entity 반환', async () => {
      const actual = () => sut.findProduct(1);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('상품 반환', async () => {
      const category = new Category('fruit');
      await subCategoryRepository.save(SubCategory.create(category, 'tropics'));

      await module
        .get(ProductAdminService)
        .addProduct(1, 'banana', 3000, 'yummy');

      const result = await sut.findProduct(1);
      const data = result.data as Product;
      expect(data.id).toBe(1);
      expect(data.name).toBe('banana');
    });
  });

  describe('getProducts', () => {
    beforeEach(async () => {
      const category1 = new Category('fruit');
      const category2 = new Category('drink');

      await subCategoryRepository.save([
        SubCategory.create(category1, 'tropics'),
        SubCategory.create(category2, 'soda'),
      ]);

      await module
        .get(ProductAdminService)
        .addProduct(1, 'banana', 3000, 'yummy');
      await module.get(ProductAdminService).addProduct(2, 'coke', 1000, 'pop');
    });

    it('sub category에 아무 상품도 없으면 빈 목록 페이징 조회', async () => {
      const dto = GetProductsRequest.create(1, 10, 3);

      const result = await sut.getProducts(dto);

      expect(result.items.length).toBe(0);
      expect(result.totalCount).toBe(0);
    });

    it('sub category id가 1인 상품만 페이징 조회', async () => {
      const dto = GetProductsRequest.create(1, 10, 1);

      const result = await sut.getProducts(dto);

      expect(result.items.length).toBe(1);
      expect(result.items[0]).toEqual({
        id: 1,
        name: 'banana',
        price: 3000,
        status: ProductStatus.SELL,
      });
      expect(result.totalCount).toBe(1);
    });

    it('모든 상품 페이징 조회', async () => {
      const dto = GetProductsRequest.create(1, 10);

      const result = await sut.getProducts(dto);

      expect(result.items.length).toBe(2);
      expect(result.items).toEqual([
        {
          id: 2,
          name: 'coke',
          price: 1000,
          status: ProductStatus.SELL,
        },
        {
          id: 1,
          name: 'banana',
          price: 3000,
          status: ProductStatus.SELL,
        },
      ]);
      expect(result.totalCount).toBe(2);
    });
  });

  describe('like', () => {
    it('찜할 상품이 없으면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);

      const actual = () => sut.like(1, user);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('찜한 상품 반환 ', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      await TestProductFactory.create(module, subCategory);

      const result = await sut.like(1, user);

      expect(result.data).toMatchObject({
        id: 1,
        name: 'banana',
        price: 1000,
        detail: 'yummy',
        status: 'Sell',
      });
    });
  });
});
