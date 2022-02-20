import { getConfigModule } from '@app/config';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalDateTime } from '@js-joda/core';
import { Entity, Repository } from 'typeorm';
import { TypeOrmTestModule } from '../typeorm.test.module';

describe('BaseTimeEntityRepository', () => {
  let sut: Repository<BaseTimeEntity>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        TypeOrmTestModule,
        TypeOrmModule.forFeature([TestEntity]),
      ],
    }).compile();

    sut = module.get('TestEntityRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  it('save로 insert시 createdAt, updatedAt은 현재 시간', async () => {
    const now = LocalDateTime.now();
    await sleep(10);

    const result = await sut.save(new TestEntity());

    expect(result.createdAt.isAfter(now)).toBe(true);
    expect(result.updatedAt.isAfter(now)).toBe(true);
  });

  it('insert로 insert시 createdAt, updatedAt은 현재 시간', async () => {
    const now = LocalDateTime.now();
    await sleep(10);

    await sut.insert(new TestEntity());

    const result = await sut.findOne({ where: { id: 1 } });
    expect(result.createdAt.isAfter(now)).toBe(true);
    expect(result.updatedAt.isAfter(now)).toBe(true);
  });

  it('save로 update시 updatedAt은 현재 시간', async () => {
    const testEntity = await sut.save(new TestEntity());
    const beforeUpdatedAt = testEntity.updatedAt;

    const updatedTestEntity = await sut.save(testEntity);

    expect(updatedTestEntity.updatedAt.isAfter(beforeUpdatedAt)).toBe(true);
  });

  it('update로 update시 updatedAt은 현재 시간', async () => {
    const testEntity = await sut.save(new TestEntity());
    const beforeUpdatedAt = testEntity.updatedAt;

    await sut.update(1, testEntity);

    const updatedTestEntity = await sut.findOne({ where: { id: 1 } });
    expect(updatedTestEntity.updatedAt.isAfter(beforeUpdatedAt)).toBe(true);
  });
});

@Entity()
class TestEntity extends BaseTimeEntity {}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
