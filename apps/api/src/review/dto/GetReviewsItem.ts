import { Review } from '@app/entity/domain/review/Review.entity';

export class GetReviewsItem {
  constructor(entity: Review) {
    this.id = entity.id;
    this.rating = entity.rating;
    this.detail = entity.detail;
    this.imagePath = entity.imagePath;
    this.selectedOption = entity.orderItem.optionDetail;
  }

  id: number;
  rating: number;
  detail: string;
  imagePath: string | null;
  selectedOption: string;
}
