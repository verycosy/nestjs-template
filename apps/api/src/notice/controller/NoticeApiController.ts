import { Controller, Get, Query } from '@nestjs/common';
import { GetNoticesRequest } from '@app/entity/domain/notice/dto/GetNoticesRequest';
import { NoticeService } from '@app/entity/domain/notice/NoticeService';

@Controller('/notice')
export class NoticeApiController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async getNotices(@Query() query: GetNoticesRequest) {
    return await this.noticeService.getNotices(query);
  }
}
