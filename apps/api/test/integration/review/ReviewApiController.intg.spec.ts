import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule } from '@app/entity/domain/category';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { ReviewModule } from '@app/entity/domain/review/ReviewModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import {
  TestOrderFactory,
  TestReviewFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EditReviewRequest,
  ReviewApiController,
  ReviewApiService,
  WriteReviewRequest,
} from '../../../../../apps/api/src/review';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';

describe('ReviewApiController', () => {
  let sut: ReviewApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        ReviewModule,
        UserModule,
        OrderModule,
        ProductModule,
        CategoryModule,
      ],
      controllers: [ReviewApiController],
      providers: [ReviewApiService],
    }).compile();

    sut = module.get(ReviewApiController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('write', () => {
    it('리뷰를 작성할 주문 항목이 없으면 not found error response 반환', async () => {
      const dto = new WriteReviewRequest(1, 5, 'this is review');
      const user = await TestUserFactory.create(module);

      const result = await sut.write(user, dto);

      expect(result.message).toBe('Order item not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('리뷰를 작성할 수 없는 주문 항목이면 server error response 반환', async () => {
      const dto = new WriteReviewRequest(1, 5, 'this is review');
      const user = await TestUserFactory.create(module);
      await TestOrderFactory.create(module, user);
      jest
        .spyOn(OrderItem.prototype, 'isReviewable')
        .mockImplementation(() => false);

      const result = await sut.write(user, dto);

      expect(result.message).toBe('Order item #1(accept) not reviewable');
      expect(result.statusCode).toBe(ResponseStatus.SERVER_ERROR);

      jest.restoreAllMocks();
    });

    it('작성된 리뷰 반환', async () => {
      const dto = new WriteReviewRequest(1, 5, 'this is review');
      const user = await TestUserFactory.create(module);
      await TestOrderFactory.create(module, user);

      const result = await sut.write(user, dto);

      expect(result.data).toEqual({
        id: 1,
        orderItemId: 1,
        rating: 5,
        detail: 'this is review',
        imagePath: null,
      });
    });
  });

  describe('edit', () => {
    it('수정할 리뷰가 없으면 not found error response 반환', async () => {
      const dto = new EditReviewRequest(3, 'this is edited review');
      const user = await TestUserFactory.create(module);

      const result = await sut.edit(user, 1, dto);

      expect(result.message).toBe('Review not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('수정할 수 없는 리뷰이면 server error response 반환', async () => {
      const dto = new EditReviewRequest(3, 'this is edited review');
      const user = await TestUserFactory.create(module);
      await TestReviewFactory.create(module, user);
      jest
        .spyOn(OrderItem.prototype, 'isReviewable')
        .mockImplementation(() => false);

      const result = await sut.edit(user, 1, dto);

      expect(result.message).toBe('Order item #1(accept) not reviewable');
      expect(result.statusCode).toBe(ResponseStatus.SERVER_ERROR);

      jest.restoreAllMocks();
    });

    it('수정된 리뷰 반환', async () => {
      const dto = new EditReviewRequest(3, 'this is edited review');
      const user = await TestUserFactory.create(module);
      await TestReviewFactory.create(module, user);
      await TestOrderFactory.create(module, user);

      const result = await sut.edit(user, 1, dto);

      expect(result.data).toEqual({
        id: 1,
        orderItemId: 1,
        rating: 3,
        detail: 'this is edited review',
        imagePath: null,
      });
    });
  });
});
