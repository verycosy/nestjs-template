import { getConfigModule } from '@app/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AddProductOptionRequest,
  AddProductRequest,
  ProductDto,
  UpdateProductRequest,
} from '../../../../admin/src/product/dto';
import { ProductAdminController } from '../../../../../apps/admin/src/product/controller/ProductAdminController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { ProductAdminService } from '../../../../admin/src/product/ProductAdminService';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ResponseStatus } from '@app/config/response';
import {
  Category,
  CategoryModule,
  SubCategory,
} from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Repository } from 'typeorm';
import { ProductOptionDto } from '@app/entity/domain/product/dto/ProductOptionDto';

describe('ProductAdminController', () => {
  let module: TestingModule;
  let sut: ProductAdminController;
  let productAdminService: ProductAdminService;
  let subCategoryRepository: Repository<SubCategory>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        CategoryModule,
        ProductModule,
      ],
      providers: [ProductAdminService],
      controllers: [ProductAdminController],
    }).compile();

    sut = module.get(ProductAdminController);
    productAdminService = module.get(ProductAdminService);
    subCategoryRepository = module.get('SubCategoryRepository');

    const category = new Category('fruit');
    await subCategoryRepository.save(SubCategory.create(category, 'tropics'));
  });

  afterEach(async () => {
    await module.close();
  });

  it('addProduct', async () => {
    const request = AddProductRequest.create(
      1,
      'awesome banana',
      30000,
      'yummy',
    );

    const result = await sut.addProduct(request);
    const data = result.data as Product;

    expect(data.id).toBe(1);
    expect(data.name).toBe('awesome banana');
    expect(data.price).toBe(30000);
    expect(data.detail).toBe('yummy');
  });

  describe('updateProduct', () => {
    const request = UpdateProductRequest.create(
      1,
      'brilliant banana',
      20000,
      'yummm',
      ProductStatus.SOLD_OUT,
    );

    it('수정할 상품이 없으면 Error Response Entity 반환', async () => {
      const { message, statusCode } = await sut.updateProduct(1, request);

      expect(message).toBe('Product not found');
      expect(statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('수정된 상품 반환', async () => {
      await productAdminService.addProduct(1, 'banana', 5000, 'yeah');

      const result = await sut.updateProduct(1, request);

      const data = result.data as ProductDto;
      expect(data).toEqual({
        id: 1,
        name: 'brilliant banana',
        price: 20000,
        detail: 'yummm',
        status: ProductStatus.SOLD_OUT,
        subCategory: {
          id: 1,
          name: 'tropics',
        },
      });
    });
  });

  describe('addProductOption', () => {
    const dto = AddProductOptionRequest.create('100g', 4000, 0);

    it('옵션을 추가할 상품이 없으면 not found error response 반환', async () => {
      const result = await sut.addProductOption(1, dto);

      expect(result.message).toBe('Product not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('추가된 상품 옵션 반환', async () => {
      await productAdminService.addProduct(1, 'banana', 5000, 'yeah');

      const result = await sut.addProductOption(1, dto);

      const data = result.data as ProductOptionDto;
      expect(data).toEqual({
        id: 1,
        detail: '100g',
        price: 4000,
        discount: 0,
      });
    });
  });

  describe('updateProductOption', () => {
    const dto = AddProductOptionRequest.create('200g', 6000, 0);

    it('수정할 상품 옵션이 없으면 not found error response 반환', async () => {
      const result = await sut.updateProductOption(1, dto);

      expect(result.message).toBe('Product option not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('수정된 상품 옵션 반환', async () => {
      await productAdminService.addProduct(1, 'banana', 5000, 'yeah');
      await productAdminService.addProductOption(1, '400g', 4000, 0);

      const result = await sut.updateProductOption(1, dto);

      const data = result.data as ProductOptionDto;
      expect(data).toEqual({
        id: 1,
        detail: '200g',
        price: 6000,
        discount: 0,
      });
    });
  });
});
