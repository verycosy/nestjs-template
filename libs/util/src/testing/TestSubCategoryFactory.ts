import { Category, SubCategory } from '@app/entity/domain/category';
import { TestingModule } from '@nestjs/testing';

export class TestSubCategoryFactory {
  static async create(
    module: TestingModule,
    categoryName = 'fruit',
    subCategoryName = 'tropics',
  ): Promise<SubCategory> {
    const category = new Category(categoryName);
    const subCategory = SubCategory.create(category, subCategoryName);
    return await module.get('SubCategoryRepository').save(subCategory);
  }
}
