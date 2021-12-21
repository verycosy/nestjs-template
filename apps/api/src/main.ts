import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { setSwagger } from 'libs/config/src';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  setSwagger(app);

  const port = app.get(ConfigService).get('PORT');
  await app.listen(port);
}
bootstrap();
