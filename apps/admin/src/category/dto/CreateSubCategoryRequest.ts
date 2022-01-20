import { IsString } from 'class-validator';

export class CreateSubCategoryRequest {
  @IsString()
  name: string;

  static create(name: string): CreateSubCategoryRequest {
    const dto = new CreateSubCategoryRequest();
    dto.name = name;

    return dto;
  }
}
