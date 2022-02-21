import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../order/OrderItem.entity';
import { Review } from './Review.entity';
import { User } from '../user/User.entity';

@Injectable()
export class ReviewService {
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
    const orderItem = await this.orderItemRepository.findOneOrFail({
      where: { id: orderItemId },
      relations: ['product'],
    });

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
    const review = await this.reviewRepository.findOneOrFail({
      where: { id: reviewId, user },
      relations: ['orderItem'],
    });

    review.update(rating, detail, imagePath);
    return await this.reviewRepository.save(review);
  }

  async remove(user: User, reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOneOrFail({
      id: reviewId,
      user,
    });
    await this.reviewRepository.remove(review);
  }
}
