import { ResponseEntity } from '@app/config/response';
import { Category } from '@app/entity/domain/category';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from '../../../../../libs/entity/src/domain/category/dto/CategoryDto';

@Controller('/category')
export class CategoryApiController {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Get()
  async findCategories(): Promise<ResponseEntity<CategoryDto[]>> {
    const categories = await this.categoryRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return ResponseEntity.OK_WITH(
      categories.map((category) => new CategoryDto(category)),
    );
  }
}
