import { User } from '@app/entity/domain/user/User.entity';

export class GetUsersItem {
  constructor(entity: User) {
    this.id = entity.id;
    this.name = entity.name;
    this.email = entity.email;
    this.phoneNumber = entity.phoneNumber;
  }

  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}
