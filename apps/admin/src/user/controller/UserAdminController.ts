import { AdminGuard } from '@app/auth';
import { Page } from '@app/config/Page';
import { ResponseEntity } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { UserService } from '@app/entity/domain/user/UserService';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { GetUsersRequest, GetUsersItem } from '../dto';
import { UpdateUserRequest } from '../dto/UpdateUserRequest';
import { UserAdminService } from '../UserAdminService';

@AdminGuard()
@Controller('/user')
export class UserAdminController {
  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly userService: UserService,
  ) {}

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
  ): Promise<ResponseEntity<User>> {
    const { name, phoneNumber, password } = body;

    const updatedUser = await this.userService.updateUserById(
      id,
      name,
      phoneNumber,
      password,
    );
    return ResponseEntity.OK_WITH(updatedUser);
  }
}
