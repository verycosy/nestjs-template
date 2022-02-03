import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { Module } from '@nestjs/common';
import { NoticeApiController, NoticeApiService } from '.';

@Module({
  imports: [NoticeModule],
  controllers: [NoticeApiController],
  providers: [NoticeApiService],
})
export class NoticeApiModule {}
