import { DateTimeUtil } from '@app/util/DateTimeUtil';
import { LocalDate } from '@js-joda/core';
import { ValueTransformer } from 'typeorm';

export class LocalDateTransformer implements ValueTransformer {
  to(entityValue: LocalDate): Date {
    return DateTimeUtil.toDate(entityValue);
  }

  from(databaseValue: Date): LocalDate {
    return DateTimeUtil.toLocalDate(databaseValue);
  }
}
