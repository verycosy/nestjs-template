import { AdminGuard, CurrentUser } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { NoticeService } from '@app/entity/domain/notice/NoticeService';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { WriteNoticeRequest } from '../dto';

@AdminGuard()
@Controller('/notice')
export class NoticeAdminController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  async write(@CurrentUser() user: User, @Body() body: WriteNoticeRequest) {
    const { title, content } = body;

    try {
      const notice = await this.noticeService.write(user, title, content);
      return ResponseEntity.OK_WITH(notice);
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @Patch('/:id')
  async edit(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() body: WriteNoticeRequest,
  ) {
    const { title, content } = body;

    try {
      const notice = await this.noticeService.edit(id, user, title, content);

      return ResponseEntity.OK_WITH(notice);
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @Delete('/:id')
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    // TODO: 누가 지웠는지
    await this.noticeService.remove(id);
    return ResponseEntity.OK();
  }
}
