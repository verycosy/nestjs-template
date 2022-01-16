import { getConfigModule } from '@app/config';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Test, TestingModule } from '@nestjs/testing';
import { AddProductRequest } from '../../../../admin/src/product/dto/AddProductRequest';
import { ProductAdminController } from '../../../../../apps/admin/src/product/controller/ProductAdminController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { ProductAdminService } from '../../../../admin/src/product/ProductAdminService';

describe('ProductAdminController', () => {
  let module: TestingModule;
  let sut: ProductAdminController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), getTypeOrmTestModule(), ProductModule],
      providers: [ProductAdminService],
      controllers: [ProductAdminController],
    }).compile();

    sut = module.get(ProductAdminController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('addProduct', async () => {
    const request = new AddProductRequest();
    request.name = 'awesome banana';
    request.price = 30000;
    request.detail = 'yummy';

    const { data } = await sut.addProduct(request);
    expect(data.id).toBe(1);
    expect(data.name).toBe('awesome banana');
    expect(data.price).toBe(30000);
    expect(data.detail).toBe('yummy');
  });
});
