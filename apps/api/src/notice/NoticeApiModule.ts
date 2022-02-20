import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { NoticeApiController, NoticeApiService } from '.';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [NoticeApiController],
  providers: [NoticeApiService],
})
export class NoticeApiModule {}
