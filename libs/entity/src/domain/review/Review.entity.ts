import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrderItem } from '../order/OrderItem.entity';
import { Product } from '../product/Product.entity';
import { User } from '../user/User.entity';
import { NotReviewableError } from './error/NotReviewableError';

@Entity('review')
export class Review extends BaseTimeEntity {
  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => OrderItem)
  @JoinColumn()
  orderItem: OrderItem;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @Column()
  rating: number;

  @Column({
    type: 'text',
  })
  detail: string;

  @Column({
    nullable: true,
  })
  imagePath?: string | null;

  static create(
    user: User,
    orderItem: OrderItem,
    rating: number,
    detail: string,
    imagePath?: string,
  ): Review {
    const review = new Review();
    review.user = user;
    review.orderItem = orderItem;
    review.product = orderItem.getProduct();
    review.update(rating, detail, imagePath);

    return review;
  }

  update(rating: number, detail: string, imagePath?: string): void {
    if (!this.orderItem.isReviewable()) {
      throw new NotReviewableError(this.orderItem);
    }

    this.rating = rating;
    this.detail = detail;
    this.imagePath = imagePath;
  }
}
