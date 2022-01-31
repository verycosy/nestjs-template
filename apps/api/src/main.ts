import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { setNestApp } from '@app/config/setNestApp';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  setNestApp(app);

  const port = app.get(ConfigService).get('PORT');
  await app.listen(port);
}
bootstrap();
