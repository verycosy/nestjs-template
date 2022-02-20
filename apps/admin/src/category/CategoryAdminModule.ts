import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import { Module } from '@nestjs/common';
import { CategoryAdminService } from './CategoryAdminService';
import { CategoryAdminController } from './controller/CategoryAdminController';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [CategoryAdminController],
  providers: [CategoryAdminService],
})
export class CategoryAdminModule {}
