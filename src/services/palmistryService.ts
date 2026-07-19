import type { BirthProfile } from '../models/types';
import { hashString } from './astroUtils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type HandSide = 'left' | 'right';
export type HandShape = 'Earth' | 'Air' | 'Fire' | 'Water';
export type LineQuality = 'deep' | 'moderate' | 'faint' | 'broken' | 'chained';
export type LineLength = 'short' | 'medium' | 'long';
export type MountProminence = 'high' | 'moderate' | 'low';

export interface PalmLine {
  name: string;
  quality: LineQuality;
  length: LineLength;
  explanation: string;
}

export interface PalmMount {
  name: string;
  prominence: MountProminence;
  meaning: string;
}

export interface PalmPrediction {
  category: 'love' | 'career' | 'health' | 'wealth' | 'spirituality';
  title: string;
  prediction: string;
  timeframe: string;
}

export interface PalmReading {
  handSide: HandSide;
  handShape: HandShape;
  handShapeDescription: string;
  dominantElement: string;
  lines: PalmLine[];
  mounts: PalmMount[];
  predictions: PalmPrediction[];
  overallSummary: string;
}

export type PalmUploadError = 'invalid_type' | 'file_too_large' | 'read_failed';

export const MAX_PALM_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PALM_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// ─── Constants ───────────────────────────────────────────────────────────────

const HAND_SHAPES: HandShape[] = ['Earth', 'Air', 'Fire', 'Water'];

const HAND_SHAPE_DESCRIPTIONS: Record<HandShape, string> = {
  Earth: 'Square palm with short fingers — practical, reliable, and grounded. You value stability and tangible results.',
  Air: 'Square palm with long fingers — intellectual, communicative, and curious. You thrive on ideas and social connection.',
  Fire: 'Long palm with short fingers — passionate, energetic, and bold. You lead with enthusiasm and creative drive.',
  Water: 'Long palm with long fingers — intuitive, empathetic, and artistic. You feel deeply and adapt to emotional currents.',
};

const LINE_QUALITIES: LineQuality[] = ['deep', 'moderate', 'faint', 'broken', 'chained'];
const LINE_LENGTHS: LineLength[] = ['short', 'medium', 'long'];
const MOUNT_PROMINENCE: MountProminence[] = ['high', 'moderate', 'low'];

const HEART_LINE_EXPLANATIONS: Record<LineQuality, string> = {
  deep: 'A deep heart line reveals strong emotional depth and lasting devotion in relationships.',
  moderate: 'A balanced heart line suggests steady affection and thoughtful approach to love.',
  faint: 'A faint heart line indicates a reserved emotional nature that opens gradually to trust.',
  broken: 'Breaks in the heart line point to significant emotional transitions that reshape your heart.',
  chained: 'A chained heart line reflects sensitivity and periods of emotional introspection.',
};

const HEAD_LINE_EXPLANATIONS: Record<LineQuality, string> = {
  deep: 'A deep head line shows sharp intellect and decisive, analytical thinking.',
  moderate: 'A moderate head line balances logic with intuition in your decision-making.',
  faint: 'A faint head line suggests a reflective mind that prefers contemplation over haste.',
  broken: 'Breaks in the head line mark shifts in perspective or major learning experiences.',
  chained: 'A chained head line indicates a versatile mind that explores many interests.',
};

const LIFE_LINE_EXPLANATIONS: Record<LineQuality, string> = {
  deep: 'A deep life line signals robust vitality and a strong connection to your physical well-being.',
  moderate: 'A moderate life line reflects steady energy and a balanced approach to health.',
  faint: 'A faint life line suggests sensitivity to environment — rest and renewal are essential.',
  broken: 'Breaks in the life line denote transformative life chapters rather than length of life.',
  chained: 'A chained life line shows adaptability through changing circumstances.',
};

const FATE_LINE_EXPLANATIONS: Record<LineQuality, string> = {
  deep: 'A prominent fate line reveals a clear sense of purpose and career direction.',
  moderate: 'A moderate fate line suggests career paths that evolve organically over time.',
  faint: 'A faint fate line indicates self-directed destiny rather than a fixed vocational path.',
  broken: 'Breaks in the fate line mark career pivots or reinventions that align with your growth.',
  chained: 'A chained fate line reflects diverse professional experiences building a unique path.',
};

const MOUNT_MEANINGS: Record<string, Record<MountProminence, string>> = {
  Jupiter: {
    high: 'Strong leadership qualities and ambition drive you toward influence and recognition.',
    moderate: 'Balanced confidence supports steady progress toward your goals.',
    low: 'Humility and teamwork are your strengths — you shine through collaboration.',
  },
  Saturn: {
    high: 'Discipline and perseverance define your approach to challenges and long-term plans.',
    moderate: 'Practical wisdom guides you through obstacles with patience.',
    low: 'Flexibility helps you navigate change without excessive self-criticism.',
  },
  Apollo: {
    high: 'Creative talent and appreciation for beauty mark your artistic expression.',
    moderate: 'A balanced creative spark enriches both work and personal pursuits.',
    low: 'Simplicity and function take priority over ornamentation in your choices.',
  },
  Mercury: {
    high: 'Quick wit and business acumen give you an edge in communication and trade.',
    moderate: 'Steady communicative skills support reliable professional relationships.',
    low: 'Thoughtful, measured speech reflects your preference for depth over speed.',
  },
  Venus: {
    high: 'Warmth and charm draw others to you — love and pleasure are central themes.',
    moderate: 'Affection flows naturally in balanced, nurturing relationships.',
    low: 'Quiet devotion and loyalty define your approach to love and friendship.',
  },
  Mars: {
    high: 'Courage and assertiveness fuel your drive to overcome obstacles.',
    moderate: 'Controlled energy channels into productive, focused action.',
    low: 'Diplomacy and patience serve you better than direct confrontation.',
  },
  Moon: {
    high: 'Strong intuition and imagination guide your inner world and creative instincts.',
    moderate: 'Emotional awareness supports empathy without overwhelming sensitivity.',
    low: 'Grounded realism keeps imagination anchored in practical reality.',
  },
};

const LOVE_PREDICTIONS = [
  'A meaningful connection deepens as you open your heart to vulnerability.',
  'Past lessons in love prepare you for a more authentic partnership ahead.',
  'Harmony in relationships grows when you balance giving with receiving.',
  'An unexpected encounter may spark a connection that feels destined.',
  'Strengthening self-love attracts relationships that mirror your worth.',
];

const CAREER_PREDICTIONS = [
  'A professional opportunity aligned with your talents emerges within months.',
  'Your persistence through challenges positions you for recognition and growth.',
  'Collaboration with a mentor or partner accelerates your career trajectory.',
  'A creative project or side venture may evolve into a significant path.',
  'Strategic patience now leads to a breakthrough in your chosen field.',
];

const HEALTH_PREDICTIONS = [
  'Mind-body practices like yoga or meditation will significantly boost your vitality.',
  'Listening to your body\'s signals prevents minor issues from becoming major concerns.',
  'Outdoor activity and nature connection restore your energy reserves.',
  'Balanced nutrition and consistent sleep patterns amplify your natural resilience.',
  'Stress management becomes a priority — boundaries protect your well-being.',
];

const WEALTH_PREDICTIONS = [
  'Financial stability grows through disciplined saving and wise investments.',
  'An opportunity to increase income aligns with skills you have been developing.',
  'Generosity and smart planning create a foundation for lasting prosperity.',
  'Avoid impulsive spending — patience in financial decisions pays dividends.',
  'A collaborative venture may open new revenue streams in the coming year.',
];

const SPIRITUALITY_PREDICTIONS = [
  'Inner reflection reveals a deeper purpose that guides your daily choices.',
  'Spiritual practices deepen your connection to intuition and inner wisdom.',
  'Letting go of old patterns opens space for profound personal transformation.',
  'Service to others becomes a pathway to meaning and fulfillment.',
  'Synchronicities increase as you align actions with your authentic values.',
];

const TIMEFRAMES = [
  'within the next 3 months',
  'over the coming 6 months',
  'within the next year',
  'in the next 2–3 years',
  'throughout this life chapter',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

/** Hash image bytes for deterministic palm analysis. */
export async function hashImageData(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let hash = 0;
  const step = Math.max(1, Math.floor(bytes.length / 256));
  for (let i = 0; i < bytes.length; i += step) {
    hash = (hash * 31 + bytes[i]) >>> 0;
  }
  hash = (hash * 31 + bytes.length) >>> 0;
  return hash;
}

export function validatePalmImage(file: File): PalmUploadError | null {
  if (!ACCEPTED_PALM_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_PALM_IMAGE_TYPES)[number])) {
    return 'invalid_type';
  }
  if (file.size > MAX_PALM_IMAGE_BYTES) {
    return 'file_too_large';
  }
  return null;
}

function buildLine(
  name: string,
  quality: LineQuality,
  length: LineLength,
  explanations: Record<LineQuality, string>,
): PalmLine {
  const lengthNote =
    length === 'long'
      ? ' Its extended reach amplifies its influence.'
      : length === 'short'
        ? ' Its concise span focuses energy in a specific life area.'
        : '';
  return {
    name,
    quality,
    length,
    explanation: explanations[quality] + lengthNote,
  };
}

function buildMounts(seed: number): PalmMount[] {
  const mountNames = Object.keys(MOUNT_MEANINGS);
  return mountNames.map((name, i) => {
    const prominence = pick(MOUNT_PROMINENCE, seed + i * 7);
    return {
      name,
      prominence,
      meaning: MOUNT_MEANINGS[name][prominence],
    };
  });
}

function buildPredictions(seed: number): PalmPrediction[] {
  const categories: PalmPrediction['category'][] = [
    'love',
    'career',
    'health',
    'wealth',
    'spirituality',
  ];
  const predictionPools: Record<PalmPrediction['category'], string[]> = {
    love: LOVE_PREDICTIONS,
    career: CAREER_PREDICTIONS,
    health: HEALTH_PREDICTIONS,
    wealth: WEALTH_PREDICTIONS,
    spirituality: SPIRITUALITY_PREDICTIONS,
  };
  const titles: Record<PalmPrediction['category'], string> = {
    love: 'Love & Relationships',
    career: 'Career & Purpose',
    health: 'Health & Vitality',
    wealth: 'Wealth & Abundance',
    spirituality: 'Spirituality & Growth',
  };

  return categories.map((category, i) => ({
    category,
    title: titles[category],
    prediction: pick(predictionPools[category], seed + i * 13),
    timeframe: pick(TIMEFRAMES, seed + i * 17),
  }));
}

// ─── Main Analysis ───────────────────────────────────────────────────────────

/**
 * Generate a palmistry reading from an uploaded palm image and birth profile.
 * Analysis is deterministic based on image hash combined with profile data.
 */
export async function analyzePalm(
  file: File,
  profile: BirthProfile,
  handSide: HandSide,
): Promise<PalmReading> {
  const imageHash = await hashImageData(file);
  const profileSeed = hashString(`${profile.name}:${profile.dateOfBirth}:${profile.birthTime}`);
  const seed = (imageHash ^ profileSeed ^ (handSide === 'left' ? 1 : 2)) >>> 0;

  const handShape = pick(HAND_SHAPES, seed);
  const dominantElement = handShape;

  const lines: PalmLine[] = [
    buildLine('Heart Line', pick(LINE_QUALITIES, seed + 3), pick(LINE_LENGTHS, seed + 4), HEART_LINE_EXPLANATIONS),
    buildLine('Head Line', pick(LINE_QUALITIES, seed + 5), pick(LINE_LENGTHS, seed + 6), HEAD_LINE_EXPLANATIONS),
    buildLine('Life Line', pick(LINE_QUALITIES, seed + 7), pick(LINE_LENGTHS, seed + 8), LIFE_LINE_EXPLANATIONS),
    buildLine('Fate Line', pick(LINE_QUALITIES, seed + 9), pick(LINE_LENGTHS, seed + 10), FATE_LINE_EXPLANATIONS),
  ];

  const mounts = buildMounts(seed + 11);
  const predictions = buildPredictions(seed + 19);

  const handLabel = handSide === 'left' ? 'receptive (left)' : 'active (right)';
  const overallSummary =
    `Your ${handLabel} hand reveals a ${handShape.toLowerCase()}-type palm — ${HAND_SHAPE_DESCRIPTIONS[handShape].split('—')[1]?.trim() ?? 'a distinctive character.'} ` +
    `Combined with your birth chart energy, the major lines suggest a life path marked by ${pick(['growth', 'transformation', 'discovery', 'achievement', 'harmony'], seed + 23)} ` +
    `and ${pick(['deep emotional wisdom', 'intellectual curiosity', 'creative expression', 'spiritual insight', 'practical mastery'], seed + 29)}.`;

  return {
    handSide,
    handShape,
    handShapeDescription: HAND_SHAPE_DESCRIPTIONS[handShape],
    dominantElement,
    lines,
    mounts,
    predictions,
    overallSummary,
  };
}

export function palmUploadErrorMessage(error: PalmUploadError): string {
  switch (error) {
    case 'invalid_type':
      return 'Please upload a JPEG, PNG, or WebP image of your palm.';
    case 'file_too_large':
      return 'Image must be 5 MB or smaller.';
    case 'read_failed':
      return 'Could not read the image. Please try again.';
  }
}
