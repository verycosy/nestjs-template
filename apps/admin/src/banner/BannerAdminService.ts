import { Page } from '@app/config/Page';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerAdminQueryRepository } from './BannerAdminQueryRepository';
import { BannerDto, GetBannersRequest } from './dto';

@Injectable()
export class BannerAdminService {
  constructor(
    @InjectRepository(BannerAdminQueryRepository)
    private readonly bannerAdminQueryRepository: BannerAdminQueryRepository,
  ) {}

  async getBanners(dto: GetBannersRequest) {
    const [items, totalCount] = await this.bannerAdminQueryRepository.paging(
      dto,
    );

    return new Page<BannerDto>(
      totalCount,
      dto.pageSize,
      items.map((product) => new BannerDto(product)),
    );
  }
}
