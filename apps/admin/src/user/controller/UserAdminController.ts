import { AdminGuard } from '@app/auth';
import { Page } from '@app/config/Page';
import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersRequest, GetUsersItem } from '../dto';
import { UserAdminService } from '../UserAdminService';

@AdminGuard()
@Controller('/user')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get('/')
  async getUsersByRole(
    @Query() query: GetUsersRequest,
  ): Promise<Page<GetUsersItem>> {
    return await this.userAdminService.getUsersByRole(query);
  }
}
