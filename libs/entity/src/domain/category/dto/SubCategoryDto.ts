import { SubCategory } from '@app/entity/domain/category';

export class SubCategoryDto {
  constructor(entity: SubCategory) {
    this.id = entity.id;
    this.name = entity.name;
  }

  private readonly id: number;
  private readonly name: string;
}
