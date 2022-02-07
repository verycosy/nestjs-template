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
    orderItem.setProduct(product);
    orderItem.setOption(option);
    orderItem.setQuantity(quantity);
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

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setProduct(product: Product): void {
    this.product = product;
    this.productName = product.name;
  }

  setOption(option: ProductOption): void {
    this.option = option;
    this.optionPrice = option.price;
    this.optionDetail = option.detail;
    this.optionDiscount = option.discount;
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

  getAmount(): number {
    return (this.optionPrice - this.optionDiscount) * this.quantity;
  }

  isReviewable(): boolean {
    return true;
  }
}
