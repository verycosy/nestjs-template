import { LocalDate } from '@js-joda/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerApiQueryRepository } from './BannerApiQueryRepository';

@Injectable()
export class BannerApiService {
  constructor(
    @InjectRepository(BannerApiQueryRepository)
    private readonly bannerApiQueryRepository: BannerApiQueryRepository,
  ) {}

  async findInProgressBanners(now: LocalDate) {
    return await this.bannerApiQueryRepository.findInProgressBanners(now);
  }
}
