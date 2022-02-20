import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { Module } from '@nestjs/common';
import { NoticeApiController } from '.';

@Module({
  imports: [NoticeModule],
  controllers: [NoticeApiController],
})
export class NoticeApiModule {}
