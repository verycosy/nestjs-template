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
  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => ProductOption)
  option: ProductOption;

  @Column()
  productName: string;

  @Column()
  optionDetail: string;

  @Column()
  optionPrice: number;

  @Column()
  optionDiscount: number;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.Accept,
  })
  status: OrderItemStatus;

  @OneToOne(() => Review)
  review: Review;

  static create(
    product: Product,
    option: ProductOption,
    quantity: number,
  ): OrderItem {
    const orderItem = new OrderItem();
    orderItem.setProduct(product);
    orderItem.setOption(option);
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

  private setProduct(product: Product): void {
    this.product = product;
    this.productName = product.name;
  }

  setOption(option: ProductOption): void {
    this.option = option;
    this.optionPrice = option.price;
    this.optionDetail = option.detail;
    this.optionDiscount = option.discount;
  }

  getAmount(): number {
    return (this.optionPrice - this.optionDiscount) * this.quantity;
  }

  isReviewable(): boolean {
    return true;
  }

  cancel(): void {
    this.status = OrderItemStatus.Cancel;
  }
}
