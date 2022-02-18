import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { Category, SubCategory } from '@app/entity/domain/category';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { CategoryAdminService } from '../CategoryAdminService';
import { CreateCategoryRequest, CreateSubCategoryRequest } from '../dto';

@AdminGuard()
@Controller('/category')
export class CategoryAdminController {
  constructor(private readonly categoryAdminService: CategoryAdminService) {}

  @Post()
  async createCategory(
    @Body() request: CreateCategoryRequest,
  ): Promise<ResponseEntity<Category>> {
    const result = await this.categoryAdminService.createCategory(request.name);
    return ResponseEntity.OK_WITH(result);
  }

  @Post('/:categoryId')
  async createSubCategory(
    @Param('categoryId') categoryId: number,
    @Body() request: CreateSubCategoryRequest,
  ): Promise<ResponseEntity<SubCategory | string>> {
    const result = await this.categoryAdminService.createSubCategory(
      categoryId,
      request.name,
    );

    return ResponseEntity.OK_WITH(result);
  }
}
