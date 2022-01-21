import { SubCategory } from '@app/entity/domain/category';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductAdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async addProduct(
    subCategoryId: number,
    name: string,
    price: number,
    detail: string,
  ): Promise<Product> {
    const subCategory = await this.subCategoryRepository.findOne({
      id: subCategoryId,
    });

    if (!subCategory) {
      return null;
    }

    const product = Product.create(subCategory, name, price, detail);
    return await this.productRepository.save(product);
  }

  async updateProduct(
    id: number,
    subCategoryId: number,
    name: string,
    price: number,
    detail: string,
    status: ProductStatus,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      return null;
    }

    const subCategory = await this.subCategoryRepository.findOne({
      id: subCategoryId,
    });

    if (!subCategory) {
      return null;
    }

    product.update(subCategory, name, price, detail, status);
    return await this.productRepository.save(product);
  }

  async addProductOption(
    id: number,
    detail: string,
    price: number,
  ): Promise<ProductOption> {
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      return null;
    }

    const productOption = product.addOption(detail, price);
    await this.productRepository.save(product);

    return productOption;
  }
}
