import { IsString } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  name: string;
}
