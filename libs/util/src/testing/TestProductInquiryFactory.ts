import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductInquiry } from '@app/entity/domain/product-inquiry/ProductInquiry.entity';
import { ProductInquiryStatus } from '@app/entity/domain/product-inquiry/type/ProductInquiryStatus';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';

export class TestProductInquiryFactory {
  static async create(
    module: TestingModule,
    user: User,
    product: Product,
    content = 'this is a inquiry content',
    visible = true,
    status = ProductInquiryStatus.Wait,
  ) {
    return await module
      .get('ProductInquiryRepository')
      .save(ProductInquiry.create(user, product, content, visible, status));
  }
}
