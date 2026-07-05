import type { ZodiacSign } from '../models/types';

export const ZODIAC_ORDER: ZodiacSign[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/** Deterministic hash from a string seed. */
export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Normalize a degree value to 0–359. */
export function normalizeDegree(degree: number): number {
  return ((degree % 360) + 360) % 360;
}

/** Map a degree (0–359) to a zodiac sign. */
export function degreeToSign(degree: number): ZodiacSign {
  const index = Math.floor(normalizeDegree(degree) / 30);
  return ZODIAC_ORDER[index];
}

/** Parse YYYY-MM-DD into a Date at local midnight. */
export function parseDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Day of year (1–366) for a date string. */
export function dayOfYear(date: string): number {
  const dt = parseDate(date);
  const start = new Date(dt.getFullYear(), 0, 0);
  const diff = dt.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Parse HH:MM into total minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Format a Date as YYYY-MM-DD. */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Count sentences in a string (by . ! ? terminators). */
export function countSentences(text: string): number {
  return (text.match(/[.!?]+/g) || []).length;
}

/** Today's date as YYYY-MM-DD. */
export function todayString(): string {
  return formatDate(new Date());
}
