import { Controller, Get, Query } from '@nestjs/common';
import { GetNoticesRequest } from '..';
import { NoticeApiService } from '../NoticeApiService';

@Controller('/notice')
export class NoticeApiController {
  constructor(private readonly noticeApiService: NoticeApiService) {}

  @Get()
  async getNotices(@Query() query: GetNoticesRequest) {
    return await this.noticeApiService.getNotices(query);
  }
}
