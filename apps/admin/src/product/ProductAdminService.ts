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
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async addProduct(
    subCategoryId: number,
    name: string,
    price: number,
    detail: string,
  ): Promise<Product> {
    const subCategory = await this.subCategoryRepository.findOneOrFail({
      id: subCategoryId,
    });

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
    const product = await this.productRepository.findOneOrFail({ id });

    const subCategory = await this.subCategoryRepository.findOneOrFail({
      id: subCategoryId,
    });

    product.update(subCategory, name, price, detail, status);
    return await this.productRepository.save(product);
  }

  async addProductOption(
    id: number,
    detail: string,
    price: number,
    discount: number,
  ): Promise<ProductOption> {
    const product = await this.productRepository.findOneOrFail({ id });

    const productOption = product.addOption(detail, price, discount);
    await this.productRepository.save(product);

    return productOption;
  }

  async updateProductOption(
    productOptionId: number,
    detail: string,
    price: number,
    discount: number,
  ): Promise<ProductOption> {
    const productOption = await this.productOptionRepository.findOneOrFail({
      id: productOptionId,
    });

    productOption.update(detail, price, discount);
    return await this.productOptionRepository.save(productOption);
  }
}
