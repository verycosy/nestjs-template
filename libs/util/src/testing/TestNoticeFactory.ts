import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

export class TestNoticeFactory {
  static async create(module: TestingModule, user: User) {
    const repository = module.get<Repository<Notice>>('NoticeRepository');
    return await repository.save(
      Notice.create(user, 'notice title', 'notice content'),
    );
  }
}
