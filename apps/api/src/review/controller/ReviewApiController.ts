import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { ReviewService } from '@app/entity/domain/review/ReviewService';
import { User } from '@app/entity/domain/user/User.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  EditReviewRequest,
  GetReviewsRequest,
  ReviewDto,
  WriteReviewRequest,
} from '../dto';
import { ReviewApiService } from '../ReviewApiService';

@Controller('/review')
export class ReviewApiController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly reviewApiService: ReviewApiService,
  ) {}

  @Get()
  async getReviews(
    @Query('productId') productId: number,
    @Body() body: GetReviewsRequest,
  ) {
    return await this.reviewApiService.getReviews(productId, body);
  }

  @AccessTokenGuard()
  @Post()
  async write(
    @CurrentUser() user: User,
    @Body() body: WriteReviewRequest,
  ): Promise<ResponseEntity<ReviewDto | string>> {
    const { orderItemId, rating, detail, imagePath } = body;

    try {
      const review = await this.reviewService.write(
        user,
        orderItemId,
        rating,
        detail,
        imagePath,
      );

      return ResponseEntity.OK_WITH(new ReviewDto(review));
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @AccessTokenGuard()
  @Patch('/:id')
  async edit(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: EditReviewRequest,
  ) {
    const { rating, detail, imagePath } = body;

    try {
      const review = await this.reviewService.edit(
        user,
        id,
        rating,
        detail,
        imagePath,
      );

      return ResponseEntity.OK_WITH(new ReviewDto(review));
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @AccessTokenGuard()
  @Delete('/:id')
  async remove(@CurrentUser() user: User, @Param('id') id: number) {
    await this.reviewService.remove(user, id);
    return ResponseEntity.OK();
  }
}
