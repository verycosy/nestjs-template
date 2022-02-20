import { PageRequest } from '@app/config/PageRequest';

export class GetNoticesRequest extends PageRequest {
  static create(pageNo: number, pageSize: number): GetNoticesRequest {
    const dto = new GetNoticesRequest();
    dto.pageSize = pageNo;
    dto.pageSize = pageSize;

    return dto;
  }
}
