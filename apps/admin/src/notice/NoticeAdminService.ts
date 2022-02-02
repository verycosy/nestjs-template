import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeAdminService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
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
    const notice = await this.noticeRepository.findOne({ id });

    if (!notice) {
      return null;
    }

    notice.update(user, title, content);
    return await this.noticeRepository.save(notice);
  }
}
