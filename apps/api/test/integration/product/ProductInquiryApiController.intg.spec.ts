import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { ProductInquiryStatus } from '@app/entity/domain/product-inquiry/type/ProductInquiryStatus';
import {
  TestProductFactory,
  TestProductInquiryFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';
import {
  ProductInquiryDto,
  WriteProductInquiryRequest,
} from '../../../../../apps/api/src/product';
import { ProductInquiryApiController } from '../../../../../apps/api/src/product/controller/ProductInquiryApiController';
import { ProductApiModule } from '../../../../../apps/api/src/product/ProductApiModule';

describe('ProductInquiryApiController', () => {
  let sut: ProductInquiryApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), ProductApiModule],
    }).compile();

    sut = module.get(ProductInquiryApiController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('write', () => {
    const dto = WriteProductInquiryRequest.create('inquiry content');

    it('문의를 남길 상품이 없으면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);

      const actual = () => sut.write(user, 1, dto);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('상품에 남긴 문의를 반환', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      await TestProductFactory.create(module, subCategory);

      const result = await sut.write(user, 1, dto);

      const data = result.data as ProductInquiryDto;
      expect(data).toEqual({
        id: 1,
        inquiry: 'inquiry content',
        visible: true,
        status: 'wait',
      });
    });
  });

  describe('edit', () => {
    const dto = WriteProductInquiryRequest.create('updated content');

    it('수정할 상품 문의가 없으면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      await TestProductFactory.create(module, subCategory);

      const actual = () => sut.edit(user, 1, dto);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('내가 남긴 상품 문의가 아니면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);
      const user2 = await TestUserFactory.create(module, {
        email: 'tester2@test.com',
      });
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      await TestProductInquiryFactory.create(module, user2, product);

      const actual = () => sut.edit(user, 1, dto);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('이미 답변이 달린 상품 문의를 수정하려고 하면 server error response 반환', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      await TestProductInquiryFactory.create(
        module,
        user,
        product,
        'inquiry content',
        true,
        ProductInquiryStatus.Complete,
      );

      const result = await sut.edit(user, 1, dto);

      expect(result.statusCode).toBe(ResponseStatus.SERVER_ERROR);
      expect(result.message).toBe('Product inquiry already completed');
    });

    it('수정된 상품 문의 반환', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      await TestProductInquiryFactory.create(module, user, product);

      const result = await sut.edit(user, 1, dto);

      const data = result.data as ProductInquiryDto;
      expect(data).toEqual({
        id: 1,
        inquiry: 'updated content',
        visible: true,
        status: 'wait',
      });
    });
  });

  describe('remove', () => {
    it('삭제할 상품 문의가 없으면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      await TestProductFactory.create(module, subCategory);

      const actual = () => sut.remove(user, 1);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('삭제되면 ok response 반환', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      await TestProductInquiryFactory.create(module, user, product);

      const result = await sut.remove(user, 1);

      expect(result.message).toBe('');
    });
  });
});
