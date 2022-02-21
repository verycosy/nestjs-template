import { CommandForbiddenError } from '@app/auth/error';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { LocalDateTimeTransformer } from '@app/entity/transformer';
import { LocalDateTime } from '@js-joda/core';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/User.entity';
import { ProductInquiryAlreadyCompletedError } from '../product/error/ProductInquiryAlreadyCompletedError';
import { Product } from '../product/Product.entity';
import { ProductInquiryStatus } from './type/ProductInquiryStatus';

@Entity('product_inquiry')
export class ProductInquiry extends BaseTimeEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({
    type: 'text',
  })
  inquiry: string;

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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin?: User;

  @Column({
    type: 'text',
    nullable: true,
  })
  answer?: string;

  @Column({
    transformer: new LocalDateTimeTransformer(),
    type: 'timestamptz',
    nullable: true,
  })
  answeredAt?: LocalDateTime;

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
    productInquiry.inquiry = content;
    productInquiry.visible = visible;
    productInquiry.status = status;

    return productInquiry;
  }

  updateContent(content: string): void {
    if (this.status === ProductInquiryStatus.Wait) {
      this.inquiry = content;
      return;
    }

    throw new ProductInquiryAlreadyCompletedError();
  }

  updateAnswer(admin: User, answer: string): void {
    if (!admin.isAdmin()) {
      throw new CommandForbiddenError(admin, 'update answer');
    }

    this.admin = admin;
    this.answer = answer;
    this.status = ProductInquiryStatus.Complete;
    this.answeredAt = LocalDateTime.now();
  }
}
