import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { LocalDate } from '@js-joda/core';

describe('Banner', () => {
  describe('create', () => {
    it('종료일이 시작일보다 앞서면 오류', () => {
      // given
      const startDate = LocalDate.parse('2020-01-02');
      const endDate = LocalDate.parse('2020-01-01');

      // when
      const actual = () => Banner.create('제목', '이미지', startDate, endDate);

      // then
      expect(actual).toThrowError();
    });

    it('시작일과 종료일이 같아도 배너 객체 반환', () => {
      // given
      const startDate = LocalDate.parse('2020-01-01');
      const endDate = LocalDate.parse('2020-01-01');

      // when
      const result = Banner.create('제목', '이미지', startDate, endDate);

      // then
      expect(result).toBeInstanceOf(Banner);
    });

    it('시작일이 종료일보다 앞서면 배너 객체 반환', () => {
      // given
      const startDate = LocalDate.parse('2020-01-01');
      const endDate = LocalDate.parse('2020-01-02');

      // when
      const result = Banner.create('제목', '이미지', startDate, endDate);

      // then
      expect(result).toBeInstanceOf(Banner);
    });
  });
});
