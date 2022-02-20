import { Page } from '@app/config/Page';
import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNoticesRequest, GetNoticesItem } from './dto';
import { Repository } from 'typeorm';
import { NoticeQueryRepository } from './NoticeQueryRepository';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    @InjectRepository(NoticeQueryRepository)
    private readonly noticeQueryRepository: NoticeQueryRepository,
  ) {}

  async write(user: User, title: string, content: string): Promise<Notice> {
    const notice = Notice.create(user, title, content);
    return await this.noticeRepository.save(notice);
  }

  async edit(
    id: number,
    user: User,
    title: string,
    content: string,
  ): Promise<Notice> {
    const notice = await this.noticeRepository.findOneOrFail({ id });

    notice.update(user, title, content);
    return await this.noticeRepository.save(notice);
  }

  async remove(id: number): Promise<void> {
    const notice = await this.noticeRepository.findOneOrFail({ id });
    await this.noticeRepository.remove(notice);
  }

  async getNotices(dto: GetNoticesRequest) {
    const [items, totalCount] = await this.noticeQueryRepository.paging(dto);

    return new Page<GetNoticesItem>(
      totalCount,
      dto.pageSize,
      items.map((item) => new GetNoticesItem(item)),
    );
  }
}
