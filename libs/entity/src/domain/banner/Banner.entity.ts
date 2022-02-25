import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { LocalDateTransformer } from '@app/entity/transformer';
import { LocalDate } from '@js-joda/core';
import { Column, Entity } from 'typeorm';
import { BannerDurationError } from './error/BannerDurationError';

@Entity('banner')
export class Banner extends BaseTimeEntity {
  @Column()
  title: string;

  @Column()
  image: string;

  @Column({
    transformer: new LocalDateTransformer(),
    type: 'timestamptz',
  })
  startDate: LocalDate;

  @Column({
    transformer: new LocalDateTransformer(),
    type: 'timestamptz',
  })
  endDate: LocalDate;

  checkDuration(): void {
    if (this.endDate.isBefore(this.startDate)) {
      throw new BannerDurationError(this.startDate, this.endDate);
    }
  }

  static create(
    title: string,
    image: string,
    startDate: LocalDate,
    endDate: LocalDate,
  ): Banner {
    const banner = new Banner();
    banner.update(title, image, startDate, endDate);

    return banner;
  }

  update(
    title: string,
    image: string,
    startDate: LocalDate,
    endDate: LocalDate,
  ): void {
    this.title = title;
    this.image = image;
    this.startDate = startDate;
    this.endDate = endDate;

    this.checkDuration();
  }
}
