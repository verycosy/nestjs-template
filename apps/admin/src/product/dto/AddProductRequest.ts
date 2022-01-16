import { IsNumber, IsString } from 'class-validator';

export class AddProductRequest {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  detail: string;
}
