import { ProductInquiry } from '@app/entity/domain/product/ProductInquiry.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductInquiryAdminService {
  constructor(
    @InjectRepository(ProductInquiry)
    private readonly productInquiryRepository: Repository<ProductInquiry>,
  ) {}

  async answer(admin: User, productInquiryId: number, answer: string) {
    const productInquiry = await this.productInquiryRepository.findOneOrFail({
      id: productInquiryId,
    });

    productInquiry.updateAnswer(admin, answer);
    return await this.productInquiryRepository.save(productInquiry);
  }
}
