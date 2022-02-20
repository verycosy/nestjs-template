import { ResponseEntity } from '@app/config/response';
import { CategoryService } from '@app/entity/domain/category/CategoryService';
import { Controller, Get } from '@nestjs/common';
import { CategoryDto } from '../../../../../libs/entity/src/domain/category/dto/CategoryDto';

@Controller('/category')
export class CategoryApiController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findCategories(): Promise<ResponseEntity<CategoryDto[]>> {
    const categories = await this.categoryService.findCategories();

    return ResponseEntity.OK_WITH(
      categories.map((category) => new CategoryDto(category)),
    );
  }
}
