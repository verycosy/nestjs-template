import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditReviewRequest {
  constructor(rating: number, detail: string, imagePath?: string) {
    this.rating = rating;
    this.detail = detail;
    this.imagePath = imagePath;
  }

  @IsNumber()
  rating: number;

  @IsString()
  detail: string;

  @IsString()
  @IsOptional()
  imagePath?: string;
}
