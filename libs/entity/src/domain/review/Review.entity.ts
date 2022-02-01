import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrderItem } from '../order/OrderItem.entity';
import { User } from '../user/User.entity';

@Entity('review')
export class Review extends BaseTimeEntity {
  constructor(
    user: User,
    orderItem: OrderItem,
    rating: number,
    detail: string,
    imagePath: string | null,
  ) {
    super();

    this.user = user;
    this.orderItem = orderItem;
    this.rating = rating;
    this.detail = detail;
    this.imagePath = imagePath;
  }

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => OrderItem)
  @JoinColumn()
  orderItem: OrderItem;

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
}
