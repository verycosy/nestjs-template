import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './Notice.entity';
import { NoticeQueryRepository } from './NoticeQueryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Notice, NoticeQueryRepository])],
  exports: [TypeOrmModule],
})
export class NoticeModule {}
