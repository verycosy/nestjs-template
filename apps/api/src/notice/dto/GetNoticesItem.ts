import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { DateTimeUtil } from '@app/util/DateTimeUtil';

export class GetNoticesItem {
  constructor(entity: Notice) {
    this.id = entity.id;
    this.title = entity.title;
    this.createdAt = DateTimeUtil.toString(entity.createdAt);
  }

  readonly id: number;
  readonly title: string;
  readonly createdAt: string;
}
