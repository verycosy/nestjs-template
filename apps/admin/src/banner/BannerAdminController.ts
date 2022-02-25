import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { BannerService } from '@app/entity/domain/banner/BannerService';
import { BannerDurationError } from '@app/entity/domain/banner/error/BannerDurationError';
import { LocalDate } from '@js-joda/core';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddBannerRequest } from './dto/AddBannerRequest';
import { BannerDto } from './dto/BannerDto';

@AdminGuard()
@Controller('/banner')
export class BannerAdminController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  async add(
    @Body() body: AddBannerRequest,
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<ResponseEntity<BannerDto>> {
    const { title, startDate, endDate } = body;

    try {
      const banner = await this.bannerService.add(
        title,
        imageFile.path,
        LocalDate.parse(startDate),
        LocalDate.parse(endDate),
      );

      return ResponseEntity.OK_WITH(new BannerDto(banner));
    } catch (err) {
      if (err instanceof BannerDurationError) {
        throw new BadRequestException(err.message);
      }

      throw err;
    }
  }

  @Patch('/:bannerId')
  @UseInterceptors(FileInterceptor('imageFile'))
  async edit(
    @Param('bannerId') bannerId: number,
    @Body() body: AddBannerRequest,
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<ResponseEntity<BannerDto>> {
    const { title, startDate, endDate } = body;

    try {
      const banner = await this.bannerService.edit(
        bannerId,
        title,
        imageFile.path,
        LocalDate.parse(startDate),
        LocalDate.parse(endDate),
      );

      return ResponseEntity.OK_WITH(new BannerDto(banner));
    } catch (err) {
      if (err instanceof BannerDurationError) {
        throw new BadRequestException(err.message);
      }

      throw err;
    }
  }

  @Delete('/:bannerId')
  async remove(
    @Param('bannerId') bannerId: number,
  ): Promise<ResponseEntity<string>> {
    await this.bannerService.remove(bannerId);
    return ResponseEntity.OK();
  }
}
