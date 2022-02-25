import { DateTimeUtil } from '@app/util/DateTimeUtil';
import { LocalDate } from '@js-joda/core';

export class BannerDurationError extends Error {
  constructor(startDate: LocalDate, endDate: LocalDate) {
    super(
      `배너 기간 오류 (시작일:${DateTimeUtil.toString(
        startDate,
      )}, 종료일:${DateTimeUtil.toString(endDate)})`,
    );
  }
}
