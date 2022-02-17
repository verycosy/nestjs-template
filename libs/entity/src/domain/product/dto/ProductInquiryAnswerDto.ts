import { DateTimeUtil } from '@app/util/DateTimeUtil';
import { ProductInquiry } from '../ProductInquiry.entity';

export class ProductInquiryAnswerDto {
  constructor(entity: ProductInquiry) {
    this.id = entity.id;
    this.adminName = entity.admin.name;
    this.answer = entity.answer;
    this.answeredAt = DateTimeUtil.toString(entity.answeredAt);
  }

  readonly id: number;
  readonly adminName: string;
  readonly answer: string;
  readonly answeredAt: string;
}
