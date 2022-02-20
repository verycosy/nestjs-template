import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { NoticeService } from './NoticeService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
