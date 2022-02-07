import { DateTimeUtil } from '@app/util/DateTimeUtil';
import { LocalDateTime } from '@js-joda/core';
import { ValueTransformer } from 'typeorm';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(entityValue: LocalDateTime): Date {
    return DateTimeUtil.toDate(entityValue);
  }

  from(databaseValue: Date): LocalDateTime {
    return DateTimeUtil.toLocalDateTime(databaseValue);
  }
}
