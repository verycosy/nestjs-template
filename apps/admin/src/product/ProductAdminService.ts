import { Product } from '@app/entity/domain/product/Product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductAdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addProduct(
    name: string,
    price: number,
    detail: string,
  ): Promise<Product> {
    const product = Product.create(name, price, detail);
    return await this.productRepository.save(product);
  }
}
