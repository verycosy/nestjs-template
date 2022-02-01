import { Review } from '@app/entity/domain/review/Review.entity';

export class ReviewDto {
  constructor(entity: Review) {
    this.id = entity.id;
    this.orderItemId = entity.orderItem.id;
    this.rating = entity.rating;
    this.detail = entity.detail;
    this.imagePath = entity.imagePath;
  }

  id: number;
  orderItemId: number;
  rating: number;
  detail: string;
  imagePath?: string | null;
}
