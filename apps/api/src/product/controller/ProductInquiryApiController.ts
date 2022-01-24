import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ProductInquiryDto, WriteProductInquiryRequest } from '../dto';
import { ProductInquiryApiService } from '../ProductInquiryApiService';

@Controller('/product/:id/inquiry')
export class ProductInquiryApiController {
  constructor(
    private readonly productInquiryApiService: ProductInquiryApiService,
  ) {}

  @AccessTokenGuard()
  @Post()
  async write(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: WriteProductInquiryRequest,
  ): Promise<ResponseEntity<ProductInquiryDto | string>> {
    const productInquiry = await this.productInquiryApiService.write(
      user,
      id,
      body.content,
    );

    if (productInquiry === null) {
      return ResponseEntity.ERROR_WITH(
        'Product not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(new ProductInquiryDto(productInquiry));
  }
}
