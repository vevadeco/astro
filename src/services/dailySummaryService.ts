import type {
  DailySummary,
  LuckyFactors,
  NatalChart,
  UnluckyFactors,
} from '../models/types';
import { classifyDate } from './calendarService';
import { todayString } from './astroUtils';

/**
 * Generates a daily summary for today based on the natal chart and factors.
 */
export function generateDailySummary(
  chart: NatalChart,
  luckyFactors: LuckyFactors,
  unluckyFactors: UnluckyFactors,
  date: string = todayString(),
): DailySummary {
  const classification = classifyDate(date, chart);

  if (classification === 'lucky') {
    const factor = luckyFactors.numbers[0] ?? luckyFactors.colors[0];
    const guidance = factor
      ? `Today is auspicious for you. Embrace your lucky number ${factor.value} and lean into activities aligned with your ${chart.sunSign} energy. ${factor.explanation}`
      : `Today is auspicious for your ${chart.sunSign} chart. Take confident steps toward goals that matter to you.`;
    return {
      date,
      classification,
      guidance,
      relevantFactors: [
        luckyFactors.numbers[0],
        luckyFactors.colors[0],
      ].filter(Boolean) as DailySummary['relevantFactors'],
    };
  }

  if (classification === 'caution') {
    const factor = unluckyFactors.numbers[0] ?? unluckyFactors.colors[0];
    const guidance = factor
      ? `Exercise caution today. Avoid major decisions involving finances or contracts. Your unfavorable number ${factor.value} signals tension. ${factor.explanation}`
      : `Exercise caution today. Planetary friction in your ${chart.sunSign} chart suggests postponing significant commitments.`;
    return {
      date,
      classification,
      guidance,
      relevantFactors: [
        unluckyFactors.numbers[0],
        unluckyFactors.colors[0],
      ].filter(Boolean) as DailySummary['relevantFactors'],
    };
  }

  if (classification === 'both') {
    const lucky = luckyFactors.colors[0];
    const unlucky = unluckyFactors.days[0];
    const guidance = `Mixed energies today. ${lucky ? `Favorable color ${lucky.value} supports creative work.` : 'Some areas look promising.'} ${unlucky ? `However, ${unlucky.value} carries caution — defer binding agreements.` : 'Balance optimism with careful planning.'}`;
    return {
      date,
      classification,
      guidance,
      relevantFactors: [lucky, unlucky].filter(Boolean) as DailySummary['relevantFactors'],
    };
  }

  return {
    date,
    classification: 'neutral',
    guidance:
      'No notable astrological influences today. A balanced day for routine activities without strong lucky or caution signals in your chart.',
    relevantFactors: [],
  };
}
