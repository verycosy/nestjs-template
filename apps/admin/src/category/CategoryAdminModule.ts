import { CategoryModule } from '@app/entity/domain/category/CategoryModule';
import { Module } from '@nestjs/common';
import { CategoryAdminController } from './controller/CategoryAdminController';

@Module({
  imports: [CategoryModule],
  controllers: [CategoryAdminController],
})
export class CategoryAdminModule {}
