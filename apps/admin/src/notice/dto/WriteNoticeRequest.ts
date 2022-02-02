import { IsString } from 'class-validator';

export class WriteNoticeRequest {
  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  @IsString()
  title: string;

  @IsString()
  content: string;
}
