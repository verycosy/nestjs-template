import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule } from '@app/entity/domain/category';
import { ProductInquiry } from '@app/entity/domain/product/ProductInquiry.entity';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { TestProductFactory, TestUserFactory } from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { WriteProductInquiryRequest } from '../../../../../apps/api/src/product';
import { ProductInquiryApiController } from '../../../../../apps/api/src/product/controller/ProductInquiryApiController';
import { ProductInquiryApiService } from '../../../../../apps/api/src/product/ProductInquiryApiService';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';

describe('ProductInquiryApiController', () => {
  let sut: ProductInquiryApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        UserModule,
        CategoryModule,
        ProductModule,
      ],
      providers: [ProductInquiryApiService],
      controllers: [ProductInquiryApiController],
    }).compile();

    sut = module.get(ProductInquiryApiController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('write', () => {
    const dto = WriteProductInquiryRequest.create('inquiry content');

    it('문의를 남길 상품이 없으면 not found error response 반환', async () => {
      const user = await TestUserFactory.create(module);

      const result = await sut.write(user, 1, dto);

      expect(result.message).toBe('Product not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('상품에 남긴 문의를 반환', async () => {
      const user = await TestUserFactory.create(module);
      await TestProductFactory.create(module);

      const result = await sut.write(user, 1, dto);

      const data = result.data as ProductInquiry;
      expect(data).toEqual({
        id: 1,
        content: 'inquiry content',
        visible: true,
        status: 'wait',
      });
    });
  });
});
