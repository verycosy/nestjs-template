import { AdminGuard, CurrentUser } from '@app/auth';
import { CommandForbiddenError } from '@app/auth/error';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { ProductInquiryAnswerDto } from '@app/entity/domain/product/dto/ProductInquiryAnswerDto';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ProductInquiryAnswerRequest } from '../dto';
import { ProductInquiryAdminService } from '../ProductInquiryAdminService';

@AdminGuard()
@Controller('/product-inquiry')
export class ProductInquiryAdminController {
  constructor(
    private readonly productInquiryAdminService: ProductInquiryAdminService,
  ) {}

  @Patch('/:id')
  async answer(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: ProductInquiryAnswerRequest,
  ): Promise<ResponseEntity<ProductInquiryAnswerDto | string>> {
    try {
      const productInquiry = await this.productInquiryAdminService.answer(
        user,
        id,
        body.answer,
      );

      return ResponseEntity.OK_WITH(
        new ProductInquiryAnswerDto(productInquiry),
      );
    } catch (err) {
      if (err instanceof CommandForbiddenError) {
        return ResponseEntity.ERROR_WITH(err.message, ResponseStatus.FORBIDDEN);
      }

      return ResponseEntity.ERROR_WITH(err.message);
    }
  }
}
