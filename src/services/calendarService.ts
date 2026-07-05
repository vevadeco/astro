import type {
  DateClassification,
  DateSummary,
  MonthCalendarData,
  NatalChart,
} from '../models/types';
import {
  formatDate,
  hashString,
  parseDate,
} from './astroUtils';

export const MIN_MONTH_OFFSET = -12;
export const MAX_MONTH_OFFSET = 12;

/**
 * Validates whether a month offset from the current month is within the allowed range.
 */
export function isValidMonthOffset(offset: number): boolean {
  return offset >= MIN_MONTH_OFFSET && offset <= MAX_MONTH_OFFSET;
}

/**
 * Returns year/month for a given offset from the current month.
 */
export function getYearMonthFromOffset(offset: number): { year: number; month: number } {
  if (!isValidMonthOffset(offset)) {
    throw new Error(`Month offset ${offset} is outside the allowed range (${MIN_MONTH_OFFSET} to ${MAX_MONTH_OFFSET}).`);
  }
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return { year: target.getFullYear(), month: target.getMonth() + 1 };
}

/** Deterministic score for a date relative to a natal chart (0–99). */
function dateScore(date: string, chart: NatalChart): number {
  const dt = parseDate(date);
  const day = dt.getDate();
  const dow = dt.getDay();
  const moonPhase = (day + Math.floor(chart.moonPosition / 30)) % 8;
  const seed = hashString(`${date}-${chart.sunSign}-${chart.moonPosition}`);
  const sunInfluence = (seed + day * 7 + dow * 11 + moonPhase * 13) % 100;
  return sunInfluence;
}

/**
 * Classifies a date as lucky, caution, both, or neutral based on the natal chart.
 */
export function classifyDate(date: string, chart: NatalChart): DateClassification {
  try {
    const score = dateScore(date, chart);
    const luckyDayBoost = chart.sunSign.charCodeAt(0) % 3;

    const isLucky = score >= 55 + luckyDayBoost || score % 17 === 0;
    const isCaution = score <= 35 || score % 23 === 0;

    if (isLucky && isCaution) return 'both';
    if (isLucky) return 'lucky';
    if (isCaution) return 'caution';
    return 'neutral';
  } catch {
    return 'neutral';
  }
}

/**
 * Generates calendar data for every day in a given month.
 */
export function getMonthDates(
  year: number,
  month: number,
  chart: NatalChart,
): MonthCalendarData {
  const dates: MonthCalendarData['dates'] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month - 1, day));
    dates.push({
      date: dateStr,
      classification: classifyDate(dateStr, chart),
    });
  }

  return { year, month, dates };
}

function buildLuckySummary(date: string, chart: NatalChart): string {
  const score = dateScore(date, chart);
  const sign = chart.sunSign.charAt(0).toUpperCase() + chart.sunSign.slice(1);
  return `Favorable planetary alignment for ${sign} on ${date}. Moon at ${Math.floor(chart.moonPosition)}° harmonizes with today's energy (score ${score}). Good for new beginnings and social connections.`;
}

function buildCautionSummary(date: string, chart: NatalChart): string {
  const score = dateScore(date, chart);
  const sign = chart.sunSign.charAt(0).toUpperCase() + chart.sunSign.slice(1);
  const base = `Challenging aspects for ${sign} on ${date}. With a tension score of ${score}, planetary friction suggests deferring major financial, legal, or relationship decisions. Focus on reflection rather than commitment.`;
  // Ensure 50–500 characters
  const padded =
    base.length >= 50
      ? base
      : base + ' Take time to review plans carefully before acting on impulse today.';
  return padded.slice(0, 500);
}

/**
 * Produces a detailed summary for a specific date.
 */
export function getDateSummary(date: string, chart: NatalChart): DateSummary {
  const classification = classifyDate(date, chart);
  const summary: DateSummary = { date, classification };

  if (classification === 'lucky' || classification === 'both') {
    summary.luckySummary = buildLuckySummary(date, chart);
  }
  if (classification === 'caution' || classification === 'both') {
    summary.cautionSummary = buildCautionSummary(date, chart);
  }

  return summary;
}

/** Count dates of a given classification in month data. */
export function countClassification(
  monthData: MonthCalendarData,
  classification: DateClassification,
): number {
  return monthData.dates.filter((d) => d.classification === classification).length;
}

/** Count lucky dates (including 'both'). */
export function countLuckyDates(monthData: MonthCalendarData): number {
  return monthData.dates.filter(
    (d) => d.classification === 'lucky' || d.classification === 'both',
  ).length;
}

/** Count caution dates (including 'both'). */
export function countCautionDates(monthData: MonthCalendarData): number {
  return monthData.dates.filter(
    (d) => d.classification === 'caution' || d.classification === 'both',
  ).length;
}
