import type {
  LuckyFactors,
  LuckyItem,
  NatalChart,
  UnluckyFactors,
  UnluckyItem,
  ZodiacSign,
} from '../models/types';
import { ZODIAC_ORDER, DAY_NAMES } from './astroUtils';

const LUCKY_COLORS: Record<ZodiacSign, string[]> = {
  aries: ['Red', 'Scarlet', 'Orange'],
  taurus: ['Green', 'Pink', 'Earth tones'],
  gemini: ['Yellow', 'Light blue', 'Silver'],
  cancer: ['Silver', 'White', 'Sea green'],
  leo: ['Gold', 'Orange', 'Purple'],
  virgo: ['Navy', 'Grey', 'Beige'],
  libra: ['Pastel blue', 'Pink', 'Lavender'],
  scorpio: ['Maroon', 'Black', 'Deep red'],
  sagittarius: ['Purple', 'Turquoise', 'Blue'],
  capricorn: ['Brown', 'Dark green', 'Grey'],
  aquarius: ['Electric blue', 'Violet', 'Silver'],
  pisces: ['Sea green', 'Lilac', 'Aqua'],
};

const UNLUCKY_COLORS: Record<ZodiacSign, string[]> = {
  aries: ['Black', 'Dark brown', 'Grey'],
  taurus: ['Bright red', 'Neon yellow', 'Orange'],
  gemini: ['Dark green', 'Brown', 'Maroon'],
  cancer: ['Red', 'Black', 'Rust'],
  leo: ['Grey', 'Brown', 'Dark blue'],
  virgo: ['Bright orange', 'Red', 'Neon pink'],
  libra: ['Brown', 'Dark grey', 'Olive'],
  scorpio: ['Pastel yellow', 'Light pink', 'White'],
  sagittarius: ['Black', 'Dark grey', 'Brown'],
  capricorn: ['Bright yellow', 'Neon green', 'Orange'],
  aquarius: ['Brown', 'Maroon', 'Dark red'],
  pisces: ['Black', 'Grey', 'Dark brown'],
};

const GEMSTONES: Record<ZodiacSign, string[]> = {
  aries: ['Diamond', 'Bloodstone'],
  taurus: ['Emerald', 'Rose Quartz'],
  gemini: ['Agate', 'Citrine'],
  cancer: ['Moonstone', 'Pearl'],
  leo: ['Ruby', 'Peridot'],
  virgo: ['Sapphire', 'Carnelian'],
  libra: ['Opal', 'Lapis Lazuli'],
  scorpio: ['Topaz', 'Obsidian'],
  sagittarius: ['Turquoise', 'Amethyst'],
  capricorn: ['Garnet', 'Onyx'],
  aquarius: ['Amethyst', 'Aquamarine'],
  pisces: ['Aquamarine', 'Jade'],
};

function signIndex(sign: ZodiacSign): number {
  return ZODIAC_ORDER.indexOf(sign);
}

function pickCount(seed: number, min: number, max: number): number {
  return min + (seed % (max - min + 1));
}

function buildLuckyItem(value: string, explanation: string): LuckyItem {
  return {
    value,
    explanation: explanation.slice(0, 200),
  };
}

function buildUnluckyItem(value: string, explanation: string): UnluckyItem {
  return {
    value,
    explanation,
  };
}

/**
 * Derives lucky factors from zodiac sign and natal chart positions.
 */
export function deriveLuckyFactors(
  sign: ZodiacSign,
  chart: NatalChart,
): LuckyFactors {
  const idx = signIndex(sign);
  const moonMod = Math.floor(chart.moonPosition / 30);

  const numCount = pickCount(idx + moonMod, 1, 3);
  const numbers: LuckyItem[] = [];
  for (let i = 0; i < numCount; i++) {
    const num = ((idx + 1) * 3 + moonMod + i * 7) % 99 || 7;
    numbers.push(
      buildLuckyItem(
        String(num),
        `Number ${num} resonates with ${sign}'s ruling energy and your moon at ${Math.floor(chart.moonPosition)}°.`,
      ),
    );
  }

  const colors = LUCKY_COLORS[sign]
    .slice(0, pickCount(moonMod + idx, 1, 3))
    .map((color) =>
      buildLuckyItem(
        color,
        `${color} aligns with ${sign}'s elemental nature and strengthens your natal chart harmony.`,
      ),
    );

  const dayCount = pickCount(idx + 2, 1, 2);
  const days: LuckyItem[] = [];
  for (let i = 0; i < dayCount; i++) {
    const day = DAY_NAMES[(idx + i * 2 + 1) % 7];
    days.push(
      buildLuckyItem(
        day,
        `${day} carries favorable planetary aspects for ${sign}, supporting confident action.`,
      ),
    );
  }

  const gemstones = GEMSTONES[sign]
    .slice(0, pickCount(idx + moonMod + 1, 1, 2))
    .map((stone) =>
      buildLuckyItem(
        stone,
        `${stone} amplifies ${sign}'s strengths and balances energies in your natal chart.`,
      ),
    );

  return { numbers, colors, days, gemstones };
}

/**
 * Derives unlucky factors from zodiac sign and natal chart positions.
 */
export function deriveUnluckyFactors(
  sign: ZodiacSign,
  chart: NatalChart,
): UnluckyFactors {
  const idx = signIndex(sign);
  const moonMod = Math.floor(chart.moonPosition / 30);

  const numCount = pickCount(idx + moonMod + 3, 1, 3);
  const numbers: UnluckyItem[] = [];
  for (let i = 0; i < numCount; i++) {
    const num = ((idx + 4) * 5 + moonMod + i * 11) % 99 || 13;
    numbers.push(
      buildUnluckyItem(
        String(num),
        `Number ${num} clashes with ${sign}'s current planetary alignment. Avoid relying on it for decisions.`,
      ),
    );
  }

  const colors = UNLUCKY_COLORS[sign]
    .slice(0, pickCount(moonMod + idx + 1, 1, 3))
    .map((color) =>
      buildUnluckyItem(
        color,
        `${color} disrupts ${sign}'s natural balance today. It may amplify tension in your chart.`,
      ),
    );

  const dayCount = pickCount(idx + 4, 1, 2);
  const days: UnluckyItem[] = [];
  for (let i = 0; i < dayCount; i++) {
    const day = DAY_NAMES[(idx + i * 3 + 5) % 7];
    days.push(
      buildUnluckyItem(
        day,
        `${day} presents challenging aspects for ${sign}. Postpone major commitments if possible.`,
      ),
    );
  }

  return { numbers, colors, days };
}
