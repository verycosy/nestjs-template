import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CartItem } from '../cart/CartItem.entity';
import { Product } from '../product/Product.entity';
import { ProductOption } from '../product/ProductOption.entity';
import { Review } from '../review/Review.entity';
import { Order } from './Order.entity';
import { OrderItemStatus } from './type/OrderItemStatus';

@Entity('order_item')
export class OrderItem extends BaseTimeEntity {
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => Product)
  private product: Product;

  @ManyToOne(() => ProductOption)
  private option: ProductOption;

  @Column()
  private productName: string;

  @Column()
  private optionDetail: string;

  @Column()
  private optionPrice: number;

  @Column()
  private optionDiscount: number;

  @Column()
  private quantity: number;

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.Accept,
  })
  private status: OrderItemStatus;

  @OneToOne(() => Review)
  review: Review;

  static create(
    product: Product,
    option: ProductOption,
    quantity: number,
  ): OrderItem {
    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.option = option;
    orderItem.productName = product.name;
    orderItem.optionDetail = option.detail;
    orderItem.optionPrice = option.price;
    orderItem.optionDiscount = option.discount;
    orderItem.quantity = quantity;
    orderItem.status = OrderItemStatus.Accept;

    return orderItem;
  }

  static createByCartItem(cartItem: CartItem): OrderItem {
    return OrderItem.create(
      cartItem.product,
      cartItem.option,
      cartItem.quantity,
    );
  }

  getStatus(): OrderItemStatus {
    return this.status;
  }

  getProduct(): Product {
    return this.product;
  }

  getProductName(): string {
    return this.productName;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getOptionPrice(): number {
    return this.optionPrice;
  }

  getOptionDetail(): string {
    return this.optionDetail;
  }

  getOptionDiscount(): number {
    return this.optionDiscount;
  }

  isReviewable(): boolean {
    return true;
  }
}
