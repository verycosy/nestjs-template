import { ResponseEntity } from '@app/config/response';
import { Category } from '@app/entity/domain/category/Category.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryRequest } from '../dto';

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
}
