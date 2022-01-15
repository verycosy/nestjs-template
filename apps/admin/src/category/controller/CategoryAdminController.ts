import { ResponseEntity } from '@app/config/response';
import { Category, SubCategory } from '@app/entity/domain/category';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryRequest, CreateSubCategoryRequest } from '../dto';

@Controller('/category')
export class CategoryAdminController {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Post()
  async createCategory(
    @Body() request: CreateCategoryRequest,
  ): Promise<ResponseEntity<Category>> {
    const category = await this.categoryRepository.save(
      new Category(request.name),
    );

    return ResponseEntity.OK_WITH(category);
  }

  @Post('/:categoryId')
  async createSubCategory(
    @Param('categoryId') categoryId: number,
    @Body() request: CreateSubCategoryRequest,
  ): Promise<ResponseEntity<SubCategory | string>> {
    const category = await this.categoryRepository.findOne({
      id: categoryId,
    });

    if (!category) {
      return ResponseEntity.ERROR_WITH('Category Not Found');
    }

    const subCategory = category.addSubCategory(request.name);
    await this.categoryRepository.save(category);

    return ResponseEntity.OK_WITH(subCategory);
  }
}
