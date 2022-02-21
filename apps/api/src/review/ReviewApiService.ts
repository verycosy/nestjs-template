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

  async getReviews(productId: number, dto: GetReviewsRequest) {
    const [items, totalCount] = await this.reviewApiQueryRepository.paging(
      productId,
      dto,
    );

    return new Page<GetReviewsItem>(
      totalCount,
      dto.pageSize,
      items.map((item) => new GetReviewsItem(item)),
    );
  }
}
