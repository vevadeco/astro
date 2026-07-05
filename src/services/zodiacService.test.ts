import { describe, it, expect } from 'vitest';
import { determineSign, getSignDescription, ZODIAC_DATE_RANGES } from './zodiacService';
import type { ZodiacSign } from '../models/types';

describe('zodiacService', () => {
  describe('determineSign', () => {
    it('should determine Aries for March 21', () => {
      expect(determineSign('1990-03-21')).toBe('aries');
    });

    it('should determine Aries for April 19', () => {
      expect(determineSign('1990-04-19')).toBe('aries');
    });

    it('should determine Taurus for April 20', () => {
      expect(determineSign('1985-04-20')).toBe('taurus');
    });

    it('should determine Taurus for May 20', () => {
      expect(determineSign('1985-05-20')).toBe('taurus');
    });

    it('should determine Gemini for May 21', () => {
      expect(determineSign('2000-05-21')).toBe('gemini');
    });

    it('should determine Gemini for June 20', () => {
      expect(determineSign('2000-06-20')).toBe('gemini');
    });

    it('should determine Cancer for June 21', () => {
      expect(determineSign('1995-06-21')).toBe('cancer');
    });

    it('should determine Cancer for July 22', () => {
      expect(determineSign('1995-07-22')).toBe('cancer');
    });

    it('should determine Leo for July 23', () => {
      expect(determineSign('1988-07-23')).toBe('leo');
    });

    it('should determine Leo for August 22', () => {
      expect(determineSign('1988-08-22')).toBe('leo');
    });

    it('should determine Virgo for August 23', () => {
      expect(determineSign('1992-08-23')).toBe('virgo');
    });

    it('should determine Virgo for September 22', () => {
      expect(determineSign('1992-09-22')).toBe('virgo');
    });

    it('should determine Libra for September 23', () => {
      expect(determineSign('1980-09-23')).toBe('libra');
    });

    it('should determine Libra for October 22', () => {
      expect(determineSign('1980-10-22')).toBe('libra');
    });

    it('should determine Scorpio for October 23', () => {
      expect(determineSign('1975-10-23')).toBe('scorpio');
    });

    it('should determine Scorpio for November 21', () => {
      expect(determineSign('1975-11-21')).toBe('scorpio');
    });

    it('should determine Sagittarius for November 22', () => {
      expect(determineSign('1991-11-22')).toBe('sagittarius');
    });

    it('should determine Sagittarius for December 21', () => {
      expect(determineSign('1991-12-21')).toBe('sagittarius');
    });

    it('should determine Capricorn for December 22', () => {
      expect(determineSign('1993-12-22')).toBe('capricorn');
    });

    it('should determine Capricorn for December 31', () => {
      expect(determineSign('1993-12-31')).toBe('capricorn');
    });

    it('should determine Capricorn for January 1', () => {
      expect(determineSign('1994-01-01')).toBe('capricorn');
    });

    it('should determine Capricorn for January 19', () => {
      expect(determineSign('1994-01-19')).toBe('capricorn');
    });

    it('should determine Aquarius for January 20', () => {
      expect(determineSign('1987-01-20')).toBe('aquarius');
    });

    it('should determine Aquarius for February 18', () => {
      expect(determineSign('1987-02-18')).toBe('aquarius');
    });

    it('should determine Pisces for February 19', () => {
      expect(determineSign('1996-02-19')).toBe('pisces');
    });

    it('should determine Pisces for March 20', () => {
      expect(determineSign('1996-03-20')).toBe('pisces');
    });

    it('should handle mid-range dates correctly', () => {
      expect(determineSign('1990-04-05')).toBe('aries');
      expect(determineSign('1990-07-15')).toBe('cancer');
      expect(determineSign('1990-10-01')).toBe('libra');
    });

    it('should throw on invalid date format', () => {
      expect(() => determineSign('invalid')).toThrow('Invalid date format');
      expect(() => determineSign('1990/03/21')).toThrow('Invalid date format');
      expect(() => determineSign('')).toThrow('Invalid date format');
    });

    it('should work regardless of year', () => {
      expect(determineSign('1900-06-21')).toBe('cancer');
      expect(determineSign('2024-06-21')).toBe('cancer');
    });
  });

  describe('getSignDescription', () => {
    const allSigns: ZodiacSign[] = [
      'aries', 'taurus', 'gemini', 'cancer',
      'leo', 'virgo', 'libra', 'scorpio',
      'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];

    it('should return a non-empty description for every zodiac sign', () => {
      for (const sign of allSigns) {
        const description = getSignDescription(sign);
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should return descriptions with 1-3 sentences', () => {
      for (const sign of allSigns) {
        const description = getSignDescription(sign);
        // Count sentence-terminating punctuation (., !, ?)
        const sentenceCount = (description.match(/[.!?]+/g) || []).length;
        expect(sentenceCount).toBeGreaterThanOrEqual(1);
        expect(sentenceCount).toBeLessThanOrEqual(3);
      }
    });

    it('should mention the sign name in its description', () => {
      for (const sign of allSigns) {
        const description = getSignDescription(sign);
        const capitalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1);
        expect(description).toContain(capitalizedSign);
      }
    });
  });

  describe('ZODIAC_DATE_RANGES', () => {
    it('should cover all 12 zodiac signs', () => {
      const allSigns: ZodiacSign[] = [
        'aries', 'taurus', 'gemini', 'cancer',
        'leo', 'virgo', 'libra', 'scorpio',
        'sagittarius', 'capricorn', 'aquarius', 'pisces',
      ];

      for (const sign of allSigns) {
        const hasSign = ZODIAC_DATE_RANGES.some(r => r.sign === sign);
        expect(hasSign).toBe(true);
      }
    });

    it('should cover every day of the year (no gaps)', () => {
      // Check that every month/day combination maps to a sign
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= daysInMonth[month - 1]; day++) {
          const dateStr = `2000-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          expect(() => determineSign(dateStr)).not.toThrow();
        }
      }
    });

    it('should assign exactly one sign per date', () => {
      // Boundary dates should not produce ambiguity
      const boundaryDates = [
        '2000-01-19', '2000-01-20',
        '2000-02-18', '2000-02-19',
        '2000-03-20', '2000-03-21',
        '2000-04-19', '2000-04-20',
        '2000-05-20', '2000-05-21',
        '2000-06-20', '2000-06-21',
        '2000-07-22', '2000-07-23',
        '2000-08-22', '2000-08-23',
        '2000-09-22', '2000-09-23',
        '2000-10-22', '2000-10-23',
        '2000-11-21', '2000-11-22',
        '2000-12-21', '2000-12-22',
      ];

      for (const date of boundaryDates) {
        const sign = determineSign(date);
        expect(sign).toBeDefined();
        expect(typeof sign).toBe('string');
      }
    });
  });
});
