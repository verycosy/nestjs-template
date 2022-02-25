import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { DateTimeUtil } from '@app/util/DateTimeUtil';

export class BannerDto {
  constructor(entity: Banner) {
    this.title = entity.title;
    this.image = entity.image;
    this.startDate = DateTimeUtil.toString(entity.startDate);
    this.endDate = DateTimeUtil.toString(entity.endDate);
  }

  readonly title: string;
  readonly image: string;
  readonly startDate: string;
  readonly endDate: string;
}
