import { Category, SubCategory } from '@app/entity/domain/category';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async createCategory(categoryName: string): Promise<Category> {
    const category = new Category(categoryName);
    return await this.categoryRepository.save(category);
  }

  async createSubCategory(
    categoryId: number,
    subCategoryName: string,
  ): Promise<SubCategory> {
    const category = await this.categoryRepository.findOneOrFail({
      id: categoryId,
    });

    return await this.subCategoryRepository.save(
      SubCategory.create(category, subCategoryName),
    );
  }

  async findCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }
}
