import { Category, SubCategory } from '@app/entity/domain/category';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryAdminService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(categoryName: string): Promise<Category> {
    const category = new Category(categoryName);
    return await this.categoryRepository.save(category);
  }

  async createSubCategory(
    categoryId: number,
    subCategoryName: string,
  ): Promise<SubCategory> {
    const category = await this.categoryRepository.findOne({
      id: categoryId,
    });

    if (!category) {
      return null;
    }

    const subCategory = category.addSubCategory(subCategoryName);
    await this.categoryRepository.save(category);

    return subCategory;
  }
}
