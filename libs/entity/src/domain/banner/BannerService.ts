import { LocalDate } from '@js-joda/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './Banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async add(
    title: string,
    image: string,
    startDate: LocalDate,
    endDate: LocalDate,
  ): Promise<Banner> {
    const banner = Banner.create(title, image, startDate, endDate);
    return await this.bannerRepository.save(banner);
  }

  async edit(
    bannerId: number,
    title: string,
    image: string,
    startDate: LocalDate,
    endDate: LocalDate,
  ): Promise<Banner> {
    const banner = await this.bannerRepository.findOneOrFail({ id: bannerId });
    banner.update(title, image, startDate, endDate);

    return await this.bannerRepository.save(banner);
  }
}
