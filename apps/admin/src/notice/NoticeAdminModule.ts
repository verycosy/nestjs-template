import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import { NoticeAdminController, NoticeAdminService } from '.';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [NoticeAdminController],
  providers: [NoticeAdminService],
})
export class NoticeAdminModule {}
