import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { Review } from '@app/entity/domain/review/Review.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewApiService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async write(
    user: User,
    orderItemId: number,
    rating: number,
    detail: string,
    imagePath?: string,
  ): Promise<Review> {
    const orderItem = await this.orderItemRepository.findOne({
      id: orderItemId,
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
}
