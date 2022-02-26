import { Banner } from '@app/entity/domain/banner/Banner.entity';

export class InProgressBannerDto {
  constructor(entity: Banner) {
    this.id = entity.id;
    this.title = entity.title;
    this.image = entity.image;
  }

  id: number;
  title: string;
  image: string;
}
