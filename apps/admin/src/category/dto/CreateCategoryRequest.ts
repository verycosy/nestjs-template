import { IsString } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  name: string;

  static create(name: string): CreateCategoryRequest {
    const dto = new CreateCategoryRequest();
    dto.name = name;

    return dto;
  }
}
