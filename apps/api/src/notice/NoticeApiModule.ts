import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeApiController } from '.';
import { NoticeApiService } from './NoticeApiService';
import { NoticeApiQueryRepository } from './NoticeApiQueryRepository';

@Module({
  imports: [NoticeModule, TypeOrmModule.forFeature([NoticeApiQueryRepository])],
  controllers: [NoticeApiController],
  providers: [NoticeApiService],
})
export class NoticeApiModule {}
