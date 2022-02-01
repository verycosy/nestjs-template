import { Page } from '@app/config/Page';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { Review } from '@app/entity/domain/review/Review.entity';
import { ReviewQueryRepository } from '@app/entity/domain/review/ReviewQueryRepository';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetReviewsItem, GetReviewsRequest } from '.';

@Injectable()
export class ReviewApiService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewQueryRepository)
    private readonly reviewQueryRepository: ReviewQueryRepository,
  ) {}

  async getReviews(productId: number, dto: GetReviewsRequest) {
    const [items, totalCount] = await this.reviewQueryRepository.paging(
      productId,
      dto,
    );

    return new Page<GetReviewsItem>(
      totalCount,
      dto.pageSize,
      items.map((item) => new GetReviewsItem(item)),
    );
  }

  async write(
    user: User,
    orderItemId: number,
    rating: number,
    detail: string,
    imagePath?: string,
  ): Promise<Review> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['product'],
    });

    if (!orderItem) {
      return null;
    }

    const review = Review.create(user, orderItem, rating, detail, imagePath);
    return await this.reviewRepository.save(review);
  }

  async edit(
    user: User,
    reviewId: number,
    rating: number,
    detail: string,
    imagePath?: string,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user },
      relations: ['orderItem'],
    });

    if (!review) {
      return null;
    }

    review.update(rating, detail, imagePath);
    return await this.reviewRepository.save(review);
  }

  async remove(user: User, reviewId: number): Promise<boolean> {
    const review = await this.reviewRepository.findOne({ id: reviewId, user });

    if (!review) {
      return false;
    }

    await this.reviewRepository.remove(review);
    return true;
  }
}
