import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityNotFoundErrorInterceptor } from './interceptor';

export function setNestApp(app: INestApplication) {
  setResponse(app);
  setSwagger(app);
}

function setSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Template')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
}

export function setResponse(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new EntityNotFoundErrorInterceptor(),
  );
}
