import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductInquiry } from '@app/entity/domain/product-inquiry/ProductInquiry.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductInquiryService {
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
    const product = await this.productRepository.findOneOrFail({
      id: productId,
    });

    const productInquiry = ProductInquiry.create(user, product, content);
    return await this.productInquiryRepository.save(productInquiry);
  }

  async edit(
    user: User,
    productInquiryId: number,
    content: string,
  ): Promise<ProductInquiry> {
    const productInquiry = await this.productInquiryRepository.findOneOrFail({
      where: { id: productInquiryId, user },
      relations: ['user'],
    });

    productInquiry.updateContent(content);
    return await this.productInquiryRepository.save(productInquiry);
  }

  async remove(user: User, productInquiryId: number): Promise<void> {
    const productInquiry = await this.productInquiryRepository.findOneOrFail({
      where: { id: productInquiryId, user },
    });

    await this.productInquiryRepository.remove(productInquiry);
  }

  async answer(admin: User, productInquiryId: number, answer: string) {
    const productInquiry = await this.productInquiryRepository.findOneOrFail({
      id: productInquiryId,
    });

    productInquiry.updateAnswer(admin, answer);
    return await this.productInquiryRepository.save(productInquiry);
  }
}
