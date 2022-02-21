import { Page } from '@app/config/Page';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNoticesItem, GetNoticesRequest } from './dto';
import { NoticeApiQueryRepository } from './NoticeApiQueryRepository';

@Injectable()
export class NoticeApiService {
  constructor(
    @InjectRepository(NoticeApiQueryRepository)
    private readonly noticeQueryRepository: NoticeApiQueryRepository,
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
