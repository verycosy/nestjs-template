import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { basename, extname } from 'path';
import { v4 as uuid } from 'uuid';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

function processingFilename(file: Express.Multer.File): string {
  const originalFilename = basename(file.originalname);
  const ext = extname(originalFilename);

  return uuid().replace(/-/gi, '') + ext;
}

const diskStorageOption = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './upload/original';

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, processingFilename(file));
  },
});

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorageOption,
    }),
  ],
  exports: [MulterModule],
})
export class UploadModule {}
