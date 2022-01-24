import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/User.entity';
import { ProductInquiryAlreadyCompletedError } from './error/ProductInquiryAlreadyCompletedError';
import { Product } from './Product.entity';
import { ProductInquiryStatus } from './type/ProductInquiryStatus';

@Entity('product_inquiry')
export class ProductInquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'enum',
    enum: ProductInquiryStatus,
    default: ProductInquiryStatus.Wait,
  })
  status: ProductInquiryStatus;

  @Column({
    type: 'boolean',
  })
  visible: boolean;

  static create(
    user: User,
    product: Product,
    content: string,
    visible = true,
    status = ProductInquiryStatus.Wait,
  ): ProductInquiry {
    const productInquiry = new ProductInquiry();
    productInquiry.user = user;
    productInquiry.product = product;
    productInquiry.content = content;
    productInquiry.visible = visible;
    productInquiry.status = status;

    return productInquiry;
  }

  updateContent(content: string): void {
    if (this.status === ProductInquiryStatus.Wait) {
      this.content = content;
      return;
    }

    throw new ProductInquiryAlreadyCompletedError();
  }
}
