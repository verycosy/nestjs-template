import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { LocalDateTransformer } from '@app/entity/transformer';
import { LocalDate } from '@js-joda/core';
import { Column, Entity } from 'typeorm';

@Entity('banner')
export class Banner extends BaseTimeEntity {
  @Column()
  title: string;

  @Column()
  image: string;

  @Column({
    transformer: new LocalDateTransformer(),
    type: 'date',
  })
  startDate: LocalDate;

  @Column({
    transformer: new LocalDateTransformer(),
    type: 'date',
  })
  endDate: LocalDate;

  static create(
    title: string,
    image: string,
    startDate: LocalDate,
    endDate: LocalDate,
  ): Banner {
    if (endDate.isBefore(startDate)) {
      throw new Error();
    }

    const banner = new Banner();
    banner.title = title;
    banner.image = image;
    banner.startDate = startDate;
    banner.endDate = endDate;

    return banner;
  }
}
