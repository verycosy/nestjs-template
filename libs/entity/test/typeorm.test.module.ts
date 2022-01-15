import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function getTypeOrmTestModule() {
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    dropSchema: process.env.NODE_ENV === 'test',
  });
}
