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
import { Category, CategoryModule } from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Repository } from 'typeorm';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';

describe('ProductApiController', () => {
  let sut: ProductApiController;
  let module: TestingModule;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        CategoryModule,
        ProductModule,
      ],
      providers: [ProductAdminService, ProductApiService],
      controllers: [ProductApiController],
    }).compile();

    sut = module.get(ProductApiController);
    categoryRepository = module.get('CategoryRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  describe('findProduct', () => {
    it('상품이 없으면 Error Response Entity 반환', async () => {
      const { message, statusCode } = await sut.findProduct(1);
      expect(message).toBe('Product not found');
      expect(statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('상품 반환', async () => {
      const category = new Category('fruit');
      category.addSubCategory('tropics');
      await categoryRepository.save(category);

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
      category1.addSubCategory('tropics');

      const category2 = new Category('drink');
      category2.addSubCategory('soda');

      await categoryRepository.save([category1, category2]);

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
});
