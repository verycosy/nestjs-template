import { AuthModule } from '@app/auth';
import { AuthCodeModule } from '@app/util/auth-code';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { basename, extname } from 'path';
import { v4 as uuid } from 'uuid';
import { UserAuthApiController, UserApiController } from './controller';
import { UserApiService } from './UserApiService';
import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';

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
    TypeOrmTestModule,
    AuthCodeModule,
    AuthModule,
    MulterModule.register({
      storage: diskStorageOption,
    }),
  ],
  controllers: [UserAuthApiController, UserApiController],
  providers: [UserApiService],
})
export class UserApiModule {}
