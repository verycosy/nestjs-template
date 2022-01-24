import { ProductInquiry } from '@app/entity/domain/product/ProductInquiry.entity';
import { ProductInquiryStatus } from '@app/entity/domain/product/type/ProductInquiryStatus';

export class ProductInquiryDto {
  constructor(entity: ProductInquiry) {
    this.id = entity.id;
    this.content = entity.content;
    this.status = entity.status;
    this.visible = entity.visible;
  }

  id: number;
  content: string;
  status: ProductInquiryStatus;
  visible: boolean;
}
