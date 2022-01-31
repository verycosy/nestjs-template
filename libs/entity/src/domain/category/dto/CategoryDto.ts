import { Category } from '@app/entity/domain/category';
import { SubCategoryDto } from './SubCategoryDto';

export class CategoryDto {
  constructor(entity: Category) {
    this.id = entity.id;
    this.name = entity.name;
    this.subCategories = entity.subCategories.map(
      (subCategory) => new SubCategoryDto(subCategory),
    );
  }

  private readonly id: number;
  private readonly name: string;
  private readonly subCategories: SubCategoryDto[];
}
