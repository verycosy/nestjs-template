import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import {
  TestOrderFactory,
  TestProductFactory,
  TestProductOptionFactory,
  TestReviewFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EditReviewRequest,
  GetReviewsRequest,
  ReviewApiController,
  ReviewApiModule,
  WriteReviewRequest,
} from '../../../../../apps/api/src/review';
import { EntityNotFoundError } from 'typeorm';

describe('ReviewApiController', () => {
  let sut: ReviewApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), ReviewApiModule],
    }).compile();

    sut = module.get(ReviewApiController);
  });

  afterEach(async () => {
    await module.close();
    jest.restoreAllMocks();
  });

  describe('write', () => {
    it('리뷰를 작성할 주문 항목이 없으면 EntityNotFoundError를 던진다', async () => {
      const dto = new WriteReviewRequest(1, 5, 'this is review');
      const user = await TestUserFactory.create(module);

      const actual = () => sut.write(user, dto);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
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
    it('수정할 리뷰가 없으면 EntityNotFoundError를 던진다', async () => {
      const dto = new EditReviewRequest(3, 'this is edited review');
      const user = await TestUserFactory.create(module);

      const actual = () => sut.edit(user, 1, dto);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
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
    });

    it('수정된 리뷰 반환', async () => {
      const dto = new EditReviewRequest(3, 'this is edited review');
      const user = await TestUserFactory.create(module);
      await TestReviewFactory.create(module, user);

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

  describe('remove', () => {
    it('삭제할 리뷰가 없으면 EntityNotFoundError를 던진다', async () => {
      const user = await TestUserFactory.create(module);

      const actual = () => sut.remove(user, 1);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('삭제되면 ok response 반환', async () => {
      const user = await TestUserFactory.create(module);
      await TestReviewFactory.create(module, user);

      const result = await sut.remove(user, 1);

      expect(result.message).toBe('');
      expect(result.statusCode).toBe(ResponseStatus.OK);
    });
  });

  describe('getProductReviews', () => {
    it('상품 후기 목록 페이징', async () => {
      const dto = GetReviewsRequest.create(1, 10);
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      const productOption = await TestProductOptionFactory.create(
        module,
        product,
      );

      await TestReviewFactory.create(module, user, product, productOption);
      await TestReviewFactory.create(module, user, product, productOption);
      await TestReviewFactory.create(module, user, product, productOption);

      const result = await sut.getProductReviews(1, dto);

      expect(result).toEqual({
        pageSize: 10,
        totalCount: 3,
        totalPage: 1,
        items: [
          {
            id: 3,
            rating: 5,
            detail: 'this is review',
            imagePath: null,
            selectedOption: 'awesome product',
          },
          {
            id: 2,
            rating: 5,
            detail: 'this is review',
            imagePath: null,
            selectedOption: 'awesome product',
          },
          {
            id: 1,
            rating: 5,
            detail: 'this is review',
            imagePath: null,
            selectedOption: 'awesome product',
          },
        ],
      });
    });
  });

  describe('getMyReviews', () => {
    it('내 후기 목록 페이징', async () => {
      const dto = GetReviewsRequest.create(1, 10);
      const user = await TestUserFactory.create(module);
      const subCategory = await TestSubCategoryFactory.create(module);
      const product = await TestProductFactory.create(module, subCategory);
      const productOption = await TestProductOptionFactory.create(
        module,
        product,
      );

      await TestReviewFactory.create(module, user, product, productOption);
      await TestReviewFactory.create(module, user, product, productOption);
      await TestReviewFactory.create(module, user, product, productOption);

      const result = await sut.getMyReviews(user, dto);

      expect(result).toEqual({
        pageSize: 10,
        totalCount: 3,
        totalPage: 1,
        items: [
          {
            id: 3,
            rating: 5,
            detail: 'this is review',
            imagePath: null,
            selectedOption: 'awesome product',
          },
          {
            id: 2,
            rating: 5,
            detail: 'this is review',
            imagePath: null,
            selectedOption: 'awesome product',
          },
          {
            id: 1,
            rating: 5,
            detail: 'this is review',
            imagePath: null,
            selectedOption: 'awesome product',
          },
        ],
      });
    });
  });
});
