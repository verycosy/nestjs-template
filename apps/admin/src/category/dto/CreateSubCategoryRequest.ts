import { IsString } from 'class-validator';

export class CreateSubCategoryRequest {
  @IsString()
  name: string;
}
