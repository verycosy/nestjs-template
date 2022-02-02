import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { Module } from '@nestjs/common';
import { NoticeAdminController, NoticeAdminService } from '.';

@Module({
  imports: [NoticeModule],
  controllers: [NoticeAdminController],
  providers: [NoticeAdminService],
})
export class NoticeAdminModule {}
