import type { ZodiacSign } from '../models/types';

/**
 * Zodiac Service implementing the ZodiacService interface.
 * Determines zodiac signs from birth dates and provides sign descriptions.
 * Requirements: 2.1, 2.2
 */

/** Date range definition for a zodiac sign (month and day boundaries). */
interface ZodiacDateRange {
  sign: ZodiacSign;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

/**
 * Standard Western tropical zodiac date ranges.
 * Each sign spans approximately 30 days.
 */
export const ZODIAC_DATE_RANGES: ZodiacDateRange[] = [
  { sign: 'capricorn', startMonth: 1, startDay: 1, endMonth: 1, endDay: 19 },
  { sign: 'aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { sign: 'aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'capricorn', startMonth: 12, startDay: 22, endMonth: 12, endDay: 31 },
];

/** Descriptions for each zodiac sign (1-3 sentences about characteristics). */
const SIGN_DESCRIPTIONS: Record<ZodiacSign, string> = {
  aries:
    'Aries is a bold and ambitious fire sign. Known for their courage and determination, Aries individuals are natural leaders who thrive on challenge and adventure.',
  taurus:
    'Taurus is a grounded and reliable earth sign. They value stability, comfort, and the finer things in life, approaching goals with patience and unwavering determination.',
  gemini:
    'Gemini is a curious and adaptable air sign. Known for their quick wit and versatility, Geminis are excellent communicators who thrive on intellectual stimulation and social connection.',
  cancer:
    'Cancer is a nurturing and intuitive water sign. Deeply connected to home and family, Cancer individuals are empathetic and protective, guided by their strong emotional intelligence.',
  leo:
    'Leo is a confident and charismatic fire sign. Natural performers with generous hearts, Leos radiate warmth and creativity, inspiring those around them with their enthusiasm.',
  virgo:
    'Virgo is a practical and analytical earth sign. With a keen eye for detail and a desire for improvement, Virgos approach life with methodical precision and genuine helpfulness.',
  libra:
    'Libra is a harmonious and diplomatic air sign. Driven by a love of balance and beauty, Libras excel at seeing multiple perspectives and creating peaceful connections.',
  scorpio:
    'Scorpio is an intense and perceptive water sign. Known for their depth of emotion and determination, Scorpios possess powerful intuition and an unwavering commitment to truth.',
  sagittarius:
    'Sagittarius is an adventurous and optimistic fire sign. Driven by a love of freedom and knowledge, Sagittarians are philosophical explorers who seek meaning through experience.',
  capricorn:
    'Capricorn is a disciplined and ambitious earth sign. With remarkable patience and strategic thinking, Capricorns steadily build toward their goals with quiet determination.',
  aquarius:
    'Aquarius is an innovative and independent air sign. Visionary thinkers with humanitarian ideals, Aquarians challenge conventions and champion progress for the collective good.',
  pisces:
    'Pisces is a compassionate and imaginative water sign. Deeply empathetic and creatively gifted, Pisces individuals navigate life through intuition and emotional wisdom.',
};

/**
 * Determines the zodiac sign for a given date of birth.
 * Matches the birth date against the standard Western tropical zodiac date ranges.
 *
 * @param dateOfBirth - Date string in YYYY-MM-DD format
 * @returns The zodiac sign for the given birth date
 * @throws Error if the date format is invalid or no matching sign is found
 */
export function determineSign(dateOfBirth: string): ZodiacSign {
  const parts = dateOfBirth.split('-');
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateOfBirth}. Expected YYYY-MM-DD.`);
  }

  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(month) || isNaN(day)) {
    throw new Error(`Invalid date format: ${dateOfBirth}. Expected YYYY-MM-DD.`);
  }

  for (const range of ZODIAC_DATE_RANGES) {
    if (range.startMonth === range.endMonth) {
      // Range within a single month
      if (month === range.startMonth && day >= range.startDay && day <= range.endDay) {
        return range.sign;
      }
    } else {
      // Range spanning two months
      if (
        (month === range.startMonth && day >= range.startDay) ||
        (month === range.endMonth && day <= range.endDay)
      ) {
        return range.sign;
      }
    }
  }

  throw new Error(`Could not determine zodiac sign for date: ${dateOfBirth}`);
}

/**
 * Returns a 1-3 sentence description for the given zodiac sign.
 *
 * @param sign - A valid zodiac sign
 * @returns Description string for the sign's characteristics
 */
export function getSignDescription(sign: ZodiacSign): string {
  return SIGN_DESCRIPTIONS[sign];
}
