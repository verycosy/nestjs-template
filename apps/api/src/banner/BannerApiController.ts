import { LocalDate } from '@js-joda/core';
import { Controller, Get } from '@nestjs/common';
import { BannerApiService } from './BannerApiService';
import { InProgressBannerDto } from './dto';

@Controller('/banner')
export class BannerApiController {
  constructor(private readonly bannerApiService: BannerApiService) {}

  @Get()
  async getInProgressBanners(): Promise<InProgressBannerDto[]> {
    const now = LocalDate.now();
    const banners = await this.bannerApiService.findInProgressBanners(now);

    return banners.map((banner) => new InProgressBannerDto(banner));
  }
}
