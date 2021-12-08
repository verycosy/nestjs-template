import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 43306,
      username: 'root',
      password: 'password',
      database: 'testdb',
      entities: [path.join(__dirname, '../src/domain/**/*.entity.ts')],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class TypeOrmTestModule {}
