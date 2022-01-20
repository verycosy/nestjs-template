import { getConfigModule } from '@app/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { ProductApiController } from '../../../../../apps/api/src/product/controller/ProductApiController';
import { ProductAdminService } from '../../../../admin/src/product/ProductAdminService';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ResponseStatus } from '@app/config/response';
import { Category, CategoryModule } from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Repository } from 'typeorm';

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
      providers: [ProductAdminService],
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
});
