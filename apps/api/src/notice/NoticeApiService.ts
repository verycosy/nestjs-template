import { Page } from '@app/config/Page';
import { NoticeQueryRepository } from '@app/entity/domain/notice/NoticeQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNoticesItem, GetNoticesRequest } from '.';

@Injectable()
export class NoticeApiService {
  constructor(
    @InjectRepository(NoticeQueryRepository)
    private readonly noticeQueryRepository: NoticeQueryRepository,
  ) {}

  async getNotices(dto: GetNoticesRequest) {
    const [items, totalCount] = await this.noticeQueryRepository.paging(dto);

    return new Page<GetNoticesItem>(
      totalCount,
      dto.pageSize,
      items.map((item) => new GetNoticesItem(item)),
    );
  }
}
