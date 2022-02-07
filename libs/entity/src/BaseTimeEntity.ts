import { LocalDateTime } from '@js-joda/core';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocalDateTimeTransformer } from './transformer';

export abstract class BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    transformer: new LocalDateTimeTransformer(),
    type: 'timestamptz',
  })
  createdAt: LocalDateTime;

  @Column({
    transformer: new LocalDateTimeTransformer(),
    type: 'timestamptz',
  })
  updatedAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeUpdate()
  protected beforeUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
