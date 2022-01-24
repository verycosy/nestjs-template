import { Category, SubCategory } from '@app/entity/domain/category';
import { Product } from '@app/entity/domain/product/Product.entity';
import { TestingModule } from '@nestjs/testing';

interface CreateParam {
  name: string;
  price: number;
  detail: string;
}

export class TestProductFactory {
  static async create(
    module: TestingModule,
    param: CreateParam = { name: 'banana', price: 1000, detail: 'yummy' },
  ): Promise<Product> {
    const { name, price, detail } = param;
    const category = new Category('fruit');
    const subCategory = SubCategory.create(category, 'tropics');
    await module.get('SubCategoryRepository').save(subCategory);

    return await module
      .get('ProductRepository')
      .save(Product.create(subCategory, name, price, detail));
  }
}
