import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'testdb',
      entities: [path.join(__dirname, '../src/domain/**/*.entity.ts')],
      synchronize: true,
      dropSchema: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class TypeOrmTestModule {}
