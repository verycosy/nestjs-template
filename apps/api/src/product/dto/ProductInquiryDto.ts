import { ProductInquiry } from '@app/entity/domain/product-inquiry/ProductInquiry.entity';
import { ProductInquiryStatus } from '@app/entity/domain/product-inquiry/type/ProductInquiryStatus';

export class ProductInquiryDto {
  constructor(entity: ProductInquiry) {
    this.id = entity.id;
    this.inquiry = entity.inquiry;
    this.status = entity.status;
    this.visible = entity.visible;
  }

  id: number;
  inquiry: string;
  status: ProductInquiryStatus;
  visible: boolean;
}
