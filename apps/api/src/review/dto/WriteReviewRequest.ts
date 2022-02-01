import { IsNumber, IsOptional, IsString } from 'class-validator';

export class WriteReviewRequest {
  constructor(
    orderItemId: number,
    rating: number,
    detail: string,
    imagePath?: string,
  ) {
    this.orderItemId = orderItemId;
    this.rating = rating;
    this.detail = detail;
    this.imagePath = imagePath;
  }

  @IsNumber()
  orderItemId: number;

  @IsNumber()
  rating: number;

  @IsString()
  detail: string;

  @IsString()
  @IsOptional()
  imagePath?: string;
}
