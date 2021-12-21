import { NestFactory } from '@nestjs/core';
import { setSwagger } from 'libs/config/src';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  setSwagger(app);

  await app.listen(3000);
}
bootstrap();
