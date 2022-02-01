import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { NotReviewableError } from '@app/entity/domain/review/error/NotReviewableError';
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

    if (!orderItem.isReviewable()) {
      throw new NotReviewableError(orderItem);
    }

    return await this.reviewRepository.save(
      new Review(user, orderItem, rating, detail, imagePath),
    );
  }
}
