import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { Category, SubCategory } from '@app/entity/domain/category';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { CategoryService } from '@app/entity/domain/category/CategoryService';
import { CreateCategoryRequest, CreateSubCategoryRequest } from '../dto';

@AdminGuard()
@Controller('/category')
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() request: CreateCategoryRequest,
  ): Promise<ResponseEntity<Category>> {
    const result = await this.categoryService.createCategory(request.name);
    return ResponseEntity.OK_WITH(result);
  }

  @Post('/:categoryId')
  async createSubCategory(
    @Param('categoryId') categoryId: number,
    @Body() request: CreateSubCategoryRequest,
  ): Promise<ResponseEntity<SubCategory | string>> {
    const result = await this.categoryService.createSubCategory(
      categoryId,
      request.name,
    );

    return ResponseEntity.OK_WITH(result);
  }
}
