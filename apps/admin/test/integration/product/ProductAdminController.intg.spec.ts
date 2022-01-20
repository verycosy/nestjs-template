import { getConfigModule } from '@app/config';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AddProductRequest,
  UpdateProductRequest,
} from '../../../../admin/src/product/dto';
import { ProductAdminController } from '../../../../../apps/admin/src/product/controller/ProductAdminController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { ProductAdminService } from '../../../../admin/src/product/ProductAdminService';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ResponseStatus } from '@app/config/response';

describe('ProductAdminController', () => {
  let module: TestingModule;
  let sut: ProductAdminController;
  let productAdminService: ProductAdminService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), getTypeOrmTestModule(), ProductModule],
      providers: [ProductAdminService],
      controllers: [ProductAdminController],
    }).compile();

    sut = module.get(ProductAdminController);
    productAdminService = module.get(ProductAdminService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('addProduct', async () => {
    const request = AddProductRequest.create('awesome banana', 30000, 'yummy');

    const { data } = await sut.addProduct(request);

    expect(data.id).toBe(1);
    expect(data.name).toBe('awesome banana');
    expect(data.price).toBe(30000);
    expect(data.detail).toBe('yummy');
  });

  describe('updateProduct', () => {
    const request = UpdateProductRequest.create(
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
      await productAdminService.addProduct('banana', 5000, 'yeah');

      const result = await sut.updateProduct(1, request);

      const data = result.data as Product;
      expect(data).toEqual({
        id: 1,
        name: 'brilliant banana',
        price: 20000,
        detail: 'yummm',
        status: ProductStatus.SOLD_OUT,
      });
    });
  });
});
