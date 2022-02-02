import { AdminGuard, CurrentUser } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Post } from '@nestjs/common';
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
}
