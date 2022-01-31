import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule } from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import {
  TestProductFactory,
  TestProductInquiryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductInquiryAdminService } from '../../../../../apps/admin/src/product/ProductInquiryAdminService';
import { ProductInquiryAdminController } from '../../../../../apps/admin/src/product/controller/ProductInquiryAdminController';
import { ProductInquiryAnswerRequest } from '../../../../../apps/admin/src/product/dto';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { TestSubCategoryFactory } from '@app/util/testing/TestSubCategoryFactory';
import { Role } from '@app/entity/domain/user/type/Role';
import { ProductInquiryAnswerDto } from '@app/entity/domain/product/dto/ProductInquiryAnswerDto';

describe('ProductInquiryAdminController', () => {
  let sut: ProductInquiryAdminController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        UserModule,
        ProductModule,
        CategoryModule,
      ],
      providers: [ProductInquiryAdminService],
      controllers: [ProductInquiryAdminController],
    }).compile();

    sut = module.get(ProductInquiryAdminController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('answer', () => {
    const dto = new ProductInquiryAnswerRequest('this is answer');

    it('답변할 상품 문의가 존재하지 않으면 not found error response 반환', async () => {
      const admin = await TestUserFactory.create(module, { role: Role.Admin });

      const result = await sut.answer(admin, 1, dto);

      expect(result.message).toBe('Product inquiry not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('관리자가 아닌 사람이 답변하면 forbidden error response 반환', async () => {
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      await TestProductInquiryFactory.create(module, user, product);

      const result = await sut.answer(user, 1, dto);

      expect(result.message).toBe('Can not update answer');
      expect(result.statusCode).toBe(ResponseStatus.FORBIDDEN);
    });

    it('답변된 내용 반환', async () => {
      const user = await TestUserFactory.create(module);
      const admin = await TestUserFactory.create(module, { role: Role.Admin });
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      await TestProductInquiryFactory.create(module, user, product);

      const result = await sut.answer(admin, 1, dto);

      const data = result.data as ProductInquiryAnswerDto;
      expect(data.adminName).toBe(admin.getName());
      expect(data.answer).toBe('this is answer');
    });
  });
});
