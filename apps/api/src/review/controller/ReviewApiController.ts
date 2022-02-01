import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { ReviewDto, WriteReviewRequest } from '../dto';
import { ReviewApiService } from '../ReviewApiService';

@Controller('/review')
export class ReviewApiController {
  constructor(private readonly reviewApiService: ReviewApiService) {}

  @AccessTokenGuard()
  @Post()
  async write(
    @CurrentUser() user: User,
    @Body() body: WriteReviewRequest,
  ): Promise<ResponseEntity<ReviewDto | string>> {
    const { orderItemId, rating, detail, imagePath } = body;

    try {
      const review = await this.reviewApiService.write(
        user,
        orderItemId,
        rating,
        detail,
        imagePath,
      );

      if (review === null) {
        return ResponseEntity.ERROR_WITH(
          'Order item not found',
          ResponseStatus.NOT_FOUND,
        );
      }

      return ResponseEntity.OK_WITH(new ReviewDto(review));
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }
}
