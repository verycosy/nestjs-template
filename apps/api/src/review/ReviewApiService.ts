import { Page } from '@app/config/Page';
import { ReviewApiQueryRepository } from './ReviewApiQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetReviewsItem, GetReviewsRequest } from '.';

@Injectable()
export class ReviewApiService {
  constructor(
    @InjectRepository(ReviewApiQueryRepository)
    private readonly reviewApiQueryRepository: ReviewApiQueryRepository,
  ) {}

  async getProductReviews(productId: number, dto: GetReviewsRequest) {
    const [items, totalCount] =
      await this.reviewApiQueryRepository.pagingByProductId(productId, dto);

    return new Page<GetReviewsItem>(
      totalCount,
      dto.pageSize,
      items.map((item) => new GetReviewsItem(item)),
    );
  }

  async getMyReviews(userId: number, dto: GetReviewsRequest) {
    const [items, totalCount] =
      await this.reviewApiQueryRepository.pagingByUserId(userId, dto);

    return new Page<GetReviewsItem>(
      totalCount,
      dto.pageSize,
      items.map((item) => new GetReviewsItem(item)),
    );
  }
}
