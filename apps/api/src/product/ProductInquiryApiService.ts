import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductInquiry } from '@app/entity/domain/product/ProductInquiry.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductInquiryApiService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductInquiry)
    private readonly productInquiryRepository: Repository<ProductInquiry>,
  ) {}

  async write(
    user: User,
    productId: number,
    content: string,
  ): Promise<ProductInquiry> {
    const product = await this.productRepository.findOne({ id: productId });

    if (!product) {
      return null;
    }

    const productInquiry = ProductInquiry.create(user, product, content);
    return await this.productInquiryRepository.save(productInquiry);
  }
}
