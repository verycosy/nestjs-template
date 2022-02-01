import { PageRequest } from '@app/config/PageRequest';

export class GetReviewsRequest extends PageRequest {
  static create(pageNo: number, pageSize: number) {
    const dto = new GetReviewsRequest();
    dto.pageNo = pageNo;
    dto.pageSize = pageSize;

    return dto;
  }
}
