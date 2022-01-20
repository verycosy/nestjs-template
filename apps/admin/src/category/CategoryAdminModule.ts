import { CategoryModule } from '@app/entity/domain/category';
import { Module } from '@nestjs/common';
import { CategoryAdminService } from './CategoryAdminService';
import { CategoryAdminController } from './controller/CategoryAdminController';

@Module({
  imports: [CategoryModule],
  controllers: [CategoryAdminController],
  providers: [CategoryAdminService],
})
export class CategoryAdminModule {}
