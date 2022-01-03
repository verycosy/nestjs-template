import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '.';

export function getConfigModule() {
  return ConfigModule.forRoot({
    validationSchema: process.env.NODE_ENV !== 'test' && configValidationSchema,
    envFilePath: `.env.${process.env.NODE_ENV}`,
  });
}
