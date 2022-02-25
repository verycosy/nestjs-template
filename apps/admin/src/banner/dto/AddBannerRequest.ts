import { IsDateString, IsString } from 'class-validator';

export class AddBannerRequest {
  @IsString()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
