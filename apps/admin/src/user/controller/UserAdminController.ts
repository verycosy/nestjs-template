import { AdminGuard } from '@app/auth';
import { Page } from '@app/config/Page';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { GetUsersRequest, GetUsersItem } from '../dto';
import { UpdateUserRequest } from '../dto/UpdateUserRequest';
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

  @Patch('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserRequest,
  ): Promise<ResponseEntity<User | string>> {
    const updatedUser = await this.userAdminService.updateUser(id, body);

    if (updatedUser === null) {
      return ResponseEntity.ERROR_WITH(
        'User not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(updatedUser);
  }
}