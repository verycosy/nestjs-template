import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
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

  async updateProduct(
    id: number,
    name: string,
    price: number,
    detail: string,
    status: ProductStatus,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      return null;
    }

    product.update(name, price, detail, status);

    return await this.productRepository.save(product);
  }
}
