import { GetReviewsRequest } from 'apps/api/src/review';
import { AbstractRepository, EntityRepository } from 'typeorm';
import { Review } from './Review.entity';

@EntityRepository(Review)
export class ReviewQueryRepository extends AbstractRepository<Review> {
  paging(
    productId: number,
    param: GetReviewsRequest,
  ): Promise<[Review[], number]> {
    const queryBuilder = this.createQueryBuilder('review')
      .where('review.product_id = :productId', { productId })
      .leftJoin('review.orderItem', 'orderItem')
      .select(['review', 'orderItem.optionDetail'])
      .orderBy({
        ['review.id']: 'DESC',
      })
      .limit(param.getLimit())
      .offset(param.getOffset());

    return queryBuilder.getManyAndCount();
  }
}
