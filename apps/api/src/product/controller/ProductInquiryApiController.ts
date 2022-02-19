import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductInquiryDto, WriteProductInquiryRequest } from '../dto';
import { ProductInquiryApiService } from '../ProductInquiryApiService';

@Controller('/product-inquiry')
export class ProductInquiryApiController {
  constructor(
    private readonly productInquiryApiService: ProductInquiryApiService,
  ) {}

  @AccessTokenGuard()
  @Post()
  async write(
    @CurrentUser() user: User,
    @Query('productId') productId: number,
    @Body() body: WriteProductInquiryRequest,
  ): Promise<ResponseEntity<ProductInquiryDto | string>> {
    const productInquiry = await this.productInquiryApiService.write(
      user,
      productId,
      body.content,
    );

    return ResponseEntity.OK_WITH(new ProductInquiryDto(productInquiry));
  }

  @AccessTokenGuard()
  @Patch('/:productInquiryId')
  async edit(
    @CurrentUser() user: User,
    @Param('productInquiryId') productInquiryId: number,
    @Body() body: WriteProductInquiryRequest,
  ): Promise<ResponseEntity<ProductInquiryDto | string>> {
    try {
      const productInquiry = await this.productInquiryApiService.edit(
        user,
        productInquiryId,
        body.content,
      );

      return ResponseEntity.OK_WITH(new ProductInquiryDto(productInquiry));
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @AccessTokenGuard()
  @Delete('/:productInquiryId')
  async remove(
    @CurrentUser() user: User,
    @Param('productInquiryId') productInquiryId: number,
  ) {
    await this.productInquiryApiService.remove(user, productInquiryId);
    return ResponseEntity.OK();
  }
}
