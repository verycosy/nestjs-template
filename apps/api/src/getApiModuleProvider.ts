import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const getApiModuleProvider = (): Provider[] => [
  {
    provide: APP_PIPE,
    useFactory: () =>
      new ValidationPipe({
        transform: true,
      }),
  },
];
