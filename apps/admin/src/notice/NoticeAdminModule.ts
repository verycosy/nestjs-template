import { Module } from '@nestjs/common';
import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { NoticeAdminController } from '.';

@Module({
  imports: [NoticeModule],
  controllers: [NoticeAdminController],
})
export class NoticeAdminModule {}
