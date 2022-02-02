import { AdminGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { WriteNoticeRequest } from '../dto';
import { NoticeAdminService } from '../NoticeAdminService';

@AdminGuard()
@Controller('/notice')
export class NoticeAdminController {
  constructor(private readonly noticeAdminService: NoticeAdminService) {}

  @Post()
  async write(@CurrentUser() user: User, @Body() body: WriteNoticeRequest) {
    const { title, content } = body;

    try {
      const notice = await this.noticeAdminService.write(user, title, content);
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
      const notice = await this.noticeAdminService.edit(
        id,
        user,
        title,
        content,
      );

      if (notice === null) {
        return ResponseEntity.ERROR_WITH(
          'Notice not found',
          ResponseStatus.NOT_FOUND,
        );
      }

      return ResponseEntity.OK_WITH(notice);
    } catch (err) {
      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @Delete('/:id')
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    const removed = await this.noticeAdminService.remove(id);

    if (!removed) {
      return ResponseEntity.ERROR_WITH(
        'Notice not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK();
  }
}
