import type { BirthProfile, NatalChart, ZodiacSign } from '../models/types';
import { ZODIAC_ORDER, hashString, dayOfYear, timeToMinutes } from './astroUtils';

/**
 * Vedic Astrology Service
 *
 * Vedic (Jyotish) astrology uses the sidereal zodiac, which accounts for the
 * precession of the equinoxes (~23.86° offset from the tropical zodiac used in Western astrology).
 * This gives most people a different Moon sign (Rashi) compared to their Western sun sign.
 *
 * Key concepts:
 * - Rashi: The sidereal zodiac sign (same 12 signs, shifted by ~23° from tropical)
 * - Nakshatra: 27 lunar mansions, each spanning 13°20' of the ecliptic
 * - Ruling Planet (Graha): Each sign and nakshatra has a planetary ruler
 */

// ─── Vedic Types ─────────────────────────────────────────────────────────────

export interface VedicProfile {
  rashi: ZodiacSign;
  rashiLabel: string;
  rashiDescription: string;
  nakshatra: NakshatraInfo;
  rulingPlanet: string;
  vedicElement: VedicElement;
  luckyFactors: VedicLuckyFactors;
  unluckyFactors: VedicUnluckyFactors;
  doshas: DoshaBalance;
}

export interface NakshatraInfo {
  name: string;
  pada: number; // 1-4
  rulingPlanet: string;
  deity: string;
  nature: string;
  description: string;
}

export type VedicElement = 'Fire' | 'Earth' | 'Air' | 'Water' | 'Ether';

export interface VedicLuckyFactors {
  mantra: string;
  gemstone: string;
  metal: string;
  direction: string;
  deity: string;
  color: string;
  number: number;
  day: string;
}

export interface VedicUnluckyFactors {
  avoidColor: string;
  avoidDirection: string;
  avoidDay: string;
  cautionPlanet: string;
}

export interface DoshaBalance {
  vata: number;  // 0-100
  pitta: number; // 0-100
  kapha: number; // 0-100
  dominant: string;
  advice: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Ayanamsa (precession offset) in degrees.
 * Using Lahiri ayanamsa which is the most widely used in Indian astrology.
 * Approximate value for current era.
 */
const AYANAMSA_DEGREES = 23.86;

/** Sanskrit names for the 12 Rashis (signs) */
const RASHI_NAMES: Record<ZodiacSign, string> = {
  aries: 'Mesha',
  taurus: 'Vrishabha',
  gemini: 'Mithuna',
  cancer: 'Karka',
  leo: 'Simha',
  virgo: 'Kanya',
  libra: 'Tula',
  scorpio: 'Vrishchika',
  sagittarius: 'Dhanu',
  capricorn: 'Makara',
  aquarius: 'Kumbha',
  pisces: 'Meena',
};

const RASHI_DESCRIPTIONS: Record<ZodiacSign, string> = {
  aries: 'Mesha natives are courageous, energetic, and pioneering. Ruled by Mars, they possess natural leadership qualities and a warrior spirit.',
  taurus: 'Vrishabha natives are steady, patient, and pleasure-seeking. Ruled by Venus, they value material comfort and have artistic sensibilities.',
  gemini: 'Mithuna natives are intellectual, communicative, and versatile. Ruled by Mercury, they excel in trade, writing, and social endeavors.',
  cancer: 'Karka natives are nurturing, intuitive, and emotionally deep. Ruled by the Moon, they are deeply connected to home and family.',
  leo: 'Simha natives are dignified, generous, and authoritative. Ruled by the Sun, they naturally command respect and radiate confidence.',
  virgo: 'Kanya natives are analytical, service-oriented, and health-conscious. Ruled by Mercury, they excel in detailed work and healing arts.',
  libra: 'Tula natives are balanced, artistic, and relationship-focused. Ruled by Venus, they seek harmony in all aspects of life.',
  scorpio: 'Vrishchika natives are intense, transformative, and deeply perceptive. Ruled by Mars, they possess tremendous willpower and occult interests.',
  sagittarius: 'Dhanu natives are philosophical, optimistic, and dharmic. Ruled by Jupiter, they are drawn to higher learning and spiritual wisdom.',
  capricorn: 'Makara natives are disciplined, ambitious, and responsible. Ruled by Saturn, they build lasting structures through persistent effort.',
  aquarius: 'Kumbha natives are humanitarian, innovative, and detached. Ruled by Saturn, they work toward collective progress and social reform.',
  pisces: 'Meena natives are compassionate, spiritual, and imaginative. Ruled by Jupiter, they possess deep empathy and connection to the divine.',
};

/** Ruling planets for each Rashi */
const RASHI_RULERS: Record<ZodiacSign, string> = {
  aries: 'Mars (Mangal)',
  taurus: 'Venus (Shukra)',
  gemini: 'Mercury (Budha)',
  cancer: 'Moon (Chandra)',
  leo: 'Sun (Surya)',
  virgo: 'Mercury (Budha)',
  libra: 'Venus (Shukra)',
  scorpio: 'Mars (Mangal)',
  sagittarius: 'Jupiter (Guru)',
  capricorn: 'Saturn (Shani)',
  aquarius: 'Saturn (Shani)',
  pisces: 'Jupiter (Guru)',
};

/** Vedic elements (Pancha Mahabhuta) mapped to signs */
const RASHI_ELEMENTS: Record<ZodiacSign, VedicElement> = {
  aries: 'Fire',
  taurus: 'Earth',
  gemini: 'Air',
  cancer: 'Water',
  leo: 'Fire',
  virgo: 'Earth',
  libra: 'Air',
  scorpio: 'Water',
  sagittarius: 'Ether',
  capricorn: 'Earth',
  aquarius: 'Air',
  pisces: 'Water',
};

/** The 27 Nakshatras with their details */
const NAKSHATRAS: {
  name: string;
  ruler: string;
  deity: string;
  nature: string;
  description: string;
}[] = [
  { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras', nature: 'Light/Swift', description: 'Bestows healing energy, speed, and new beginnings.' },
  { name: 'Bharani', ruler: 'Venus', deity: 'Yama', nature: 'Fierce', description: 'Carries transformative power, discipline, and creative force.' },
  { name: 'Krittika', ruler: 'Sun', deity: 'Agni', nature: 'Mixed', description: 'Brings purification, sharp intellect, and cutting through illusion.' },
  { name: 'Rohini', ruler: 'Moon', deity: 'Brahma', nature: 'Fixed', description: 'Bestows beauty, fertility, material growth, and artistic talent.' },
  { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma', nature: 'Soft', description: 'Brings curiosity, searching nature, and gentle exploration.' },
  { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', nature: 'Sharp', description: 'Carries storms of transformation, effort, and intellectual breakthroughs.' },
  { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi', nature: 'Moveable', description: 'Bestows renewal, return to goodness, and spiritual regeneration.' },
  { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati', nature: 'Light', description: 'The most auspicious nakshatra — brings nourishment, dharma, and prosperity.' },
  { name: 'Ashlesha', ruler: 'Mercury', deity: 'Nagas', nature: 'Sharp', description: 'Carries kundalini energy, mystical insight, and psychological depth.' },
  { name: 'Magha', ruler: 'Ketu', deity: 'Pitris', nature: 'Fierce', description: 'Bestows royal bearing, ancestral connection, and authority.' },
  { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga', nature: 'Fierce', description: 'Brings enjoyment, creative expression, and marital bliss.' },
  { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman', nature: 'Fixed', description: 'Bestows patronage, friendship, and philanthropic nature.' },
  { name: 'Hasta', ruler: 'Moon', deity: 'Savitar', nature: 'Light', description: 'Brings skill with hands, craftsmanship, and quick manifestation.' },
  { name: 'Chitra', ruler: 'Mars', deity: 'Vishvakarma', nature: 'Soft', description: 'Bestows artistic brilliance, beauty, and creative architecture.' },
  { name: 'Swati', ruler: 'Rahu', deity: 'Vayu', nature: 'Moveable', description: 'Carries independence, flexibility, and commercial acumen.' },
  { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra-Agni', nature: 'Mixed', description: 'Brings determination, goal-focus, and eventual triumph.' },
  { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra', nature: 'Soft', description: 'Bestows friendship, devotion, and success in foreign lands.' },
  { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra', nature: 'Sharp', description: 'Carries seniority, protective power, and occult mastery.' },
  { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', nature: 'Sharp', description: 'Brings uprooting, investigation of roots, and spiritual liberation.' },
  { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas', nature: 'Fierce', description: 'Bestows invincibility, purification, and declaration of truth.' },
  { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvedevas', nature: 'Fixed', description: 'Carries final victory, universal principles, and leadership.' },
  { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu', nature: 'Moveable', description: 'Bestows learning through listening, connection, and pervasive knowledge.' },
  { name: 'Dhanishta', ruler: 'Mars', deity: 'Vasus', nature: 'Moveable', description: 'Brings wealth, musical talent, and group prosperity.' },
  { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', nature: 'Moveable', description: 'Carries healing, veiling, and mastery of cosmic waters.' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada', nature: 'Fierce', description: 'Bestows spiritual fire, penance, and transformative heat.' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahir Budhnya', nature: 'Fixed', description: 'Carries deep wisdom, kundalini mastery, and cosmic stability.' },
  { name: 'Revati', ruler: 'Mercury', deity: 'Pushan', nature: 'Soft', description: 'Bestows safe journeys, nourishment, and completion of cycles.' },
];

const VEDIC_GEMSTONES: Record<string, string> = {
  'Sun (Surya)': 'Ruby (Manik)',
  'Moon (Chandra)': 'Pearl (Moti)',
  'Mars (Mangal)': 'Red Coral (Moonga)',
  'Mercury (Budha)': 'Emerald (Panna)',
  'Jupiter (Guru)': 'Yellow Sapphire (Pukhraj)',
  'Venus (Shukra)': 'Diamond (Heera)',
  'Saturn (Shani)': 'Blue Sapphire (Neelam)',
  'Ketu': 'Cat\'s Eye (Lehsunia)',
  'Rahu': 'Hessonite (Gomed)',
};

const VEDIC_METALS: Record<string, string> = {
  'Sun (Surya)': 'Gold',
  'Moon (Chandra)': 'Silver',
  'Mars (Mangal)': 'Copper',
  'Mercury (Budha)': 'Bronze',
  'Jupiter (Guru)': 'Gold',
  'Venus (Shukra)': 'Silver',
  'Saturn (Shani)': 'Iron',
  'Ketu': 'Mixed metals',
  'Rahu': 'Lead',
};

const VEDIC_DAYS: Record<string, string> = {
  'Sun (Surya)': 'Sunday',
  'Moon (Chandra)': 'Monday',
  'Mars (Mangal)': 'Tuesday',
  'Mercury (Budha)': 'Wednesday',
  'Jupiter (Guru)': 'Thursday',
  'Venus (Shukra)': 'Friday',
  'Saturn (Shani)': 'Saturday',
  'Ketu': 'Tuesday',
  'Rahu': 'Saturday',
};

const VEDIC_COLORS: Record<string, string> = {
  'Sun (Surya)': 'Saffron/Orange',
  'Moon (Chandra)': 'White/Cream',
  'Mars (Mangal)': 'Red',
  'Mercury (Budha)': 'Green',
  'Jupiter (Guru)': 'Yellow',
  'Venus (Shukra)': 'White/Pink',
  'Saturn (Shani)': 'Dark Blue/Black',
  'Ketu': 'Grey/Smoke',
  'Rahu': 'Blue/Ultraviolet',
};

const VEDIC_DIRECTIONS: Record<string, string> = {
  'Sun (Surya)': 'East',
  'Moon (Chandra)': 'North-West',
  'Mars (Mangal)': 'South',
  'Mercury (Budha)': 'North',
  'Jupiter (Guru)': 'North-East',
  'Venus (Shukra)': 'South-East',
  'Saturn (Shani)': 'West',
  'Ketu': 'South-West',
  'Rahu': 'South-West',
};

const VEDIC_DEITIES: Record<string, string> = {
  'Sun (Surya)': 'Lord Surya / Lord Rama',
  'Moon (Chandra)': 'Lord Shiva / Goddess Parvati',
  'Mars (Mangal)': 'Lord Hanuman / Lord Kartikeya',
  'Mercury (Budha)': 'Lord Vishnu / Lord Ganesha',
  'Jupiter (Guru)': 'Lord Brihaspati / Lord Dakshinamurthy',
  'Venus (Shukra)': 'Goddess Lakshmi / Goddess Saraswati',
  'Saturn (Shani)': 'Lord Shani / Lord Yama',
  'Ketu': 'Lord Ganesha',
  'Rahu': 'Goddess Durga',
};

const VEDIC_MANTRAS: Record<string, string> = {
  'Sun (Surya)': 'Om Hraam Hreem Hraum Sah Suryaya Namaha',
  'Moon (Chandra)': 'Om Shraam Shreem Shraum Sah Chandraya Namaha',
  'Mars (Mangal)': 'Om Kraam Kreem Kraum Sah Bhaumaya Namaha',
  'Mercury (Budha)': 'Om Braam Breem Braum Sah Budhaya Namaha',
  'Jupiter (Guru)': 'Om Graam Greem Graum Sah Gurave Namaha',
  'Venus (Shukra)': 'Om Draam Dreem Draum Sah Shukraya Namaha',
  'Saturn (Shani)': 'Om Praam Preem Praum Sah Shanaischaraya Namaha',
  'Ketu': 'Om Sraam Sreem Sraum Sah Ketave Namaha',
  'Rahu': 'Om Bhraam Bhreem Bhraum Sah Rahave Namaha',
};

// ─── Calculation Functions ───────────────────────────────────────────────────

/**
 * Converts a tropical (Western) degree to sidereal (Vedic) by subtracting ayanamsa.
 */
function tropicalToSidereal(tropicalDegree: number): number {
  let sidereal = tropicalDegree - AYANAMSA_DEGREES;
  if (sidereal < 0) sidereal += 360;
  return sidereal;
}

/**
 * Determines the Vedic Rashi (sidereal sign) from a tropical moon position.
 */
function getMoonRashi(moonDegree: number): ZodiacSign {
  const sidereal = tropicalToSidereal(moonDegree);
  const index = Math.floor(sidereal / 30);
  return ZODIAC_ORDER[index];
}

/**
 * Determines the Nakshatra and Pada from a sidereal moon degree.
 * Each nakshatra spans 13°20' (13.333°), and each pada is 3°20' (3.333°).
 */
function getNakshatra(moonDegree: number): { index: number; pada: number } {
  const sidereal = tropicalToSidereal(moonDegree);
  const nakshatraSpan = 360 / 27; // 13.333°
  const index = Math.floor(sidereal / nakshatraSpan);
  const positionInNakshatra = sidereal - index * nakshatraSpan;
  const pada = Math.floor(positionInNakshatra / (nakshatraSpan / 4)) + 1;
  return { index: Math.min(index, 26), pada: Math.min(pada, 4) };
}

/**
 * Calculates Dosha (Ayurvedic constitution) balance based on birth chart.
 */
function calculateDoshas(profile: BirthProfile, chart: NatalChart): DoshaBalance {
  const seed = hashString(`dosha-${profile.dateOfBirth}-${profile.birthTime}`);
  const doy = dayOfYear(profile.dateOfBirth);
  const minutes = timeToMinutes(profile.birthTime);

  // Distribute based on chart factors
  const moonFactor = chart.moonPosition / 360;
  const timeFactor = minutes / 1440;
  const dayFactor = (doy % 90) / 90;

  let vata = Math.round(((seed % 40) + moonFactor * 30 + timeFactor * 20) % 100);
  let pitta = Math.round(((seed % 35) + dayFactor * 35 + (1 - moonFactor) * 25) % 100);
  let kapha = Math.round(((seed % 30) + (1 - timeFactor) * 30 + (1 - dayFactor) * 20) % 100);

  // Normalize to sum to approximately 100
  const total = vata + pitta + kapha;
  if (total > 0) {
    vata = Math.round((vata / total) * 100);
    pitta = Math.round((pitta / total) * 100);
    kapha = 100 - vata - pitta;
  }

  let dominant: string;
  let advice: string;

  if (vata >= pitta && vata >= kapha) {
    dominant = 'Vata';
    advice = 'Favor warm, grounding foods and routines. Avoid excess cold, dryness, and irregular schedules. Meditation and oil massage (Abhyanga) are balancing.';
  } else if (pitta >= vata && pitta >= kapha) {
    dominant = 'Pitta';
    advice = 'Favor cooling foods and calm environments. Avoid excess heat, spicy foods, and competitive stress. Moon gazing and nature walks are balancing.';
  } else {
    dominant = 'Kapha';
    advice = 'Favor light, warm, stimulating activities. Avoid excess rest, heavy foods, and stagnation. Vigorous exercise and early rising are balancing.';
  }

  return { vata, pitta, kapha, dominant, advice };
}

/**
 * Determines lucky number based on Vedic numerology (birth date reduction).
 */
function getVedicLuckyNumber(dateOfBirth: string): number {
  const parts = dateOfBirth.split('-');
  const day = parseInt(parts[2], 10);
  // Reduce to single digit (Vedic method)
  let num = day;
  while (num > 9) {
    num = Math.floor(num / 10) + (num % 10);
  }
  return num;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Generates a complete Vedic astrology profile from birth details and natal chart.
 * Uses the Moon's position (primary indicator in Vedic astrology) to determine
 * Rashi and Nakshatra, then derives all related factors.
 */
export function generateVedicProfile(
  profile: BirthProfile,
  chart: NatalChart,
): VedicProfile {
  // Vedic astrology primarily uses the Moon sign (Rashi)
  const rashi = getMoonRashi(chart.moonPosition);
  const rashiLabel = RASHI_NAMES[rashi];
  const rashiDescription = RASHI_DESCRIPTIONS[rashi];
  const rulingPlanet = RASHI_RULERS[rashi];
  const vedicElement = RASHI_ELEMENTS[rashi];

  // Nakshatra from Moon
  const { index: nakshatraIndex, pada } = getNakshatra(chart.moonPosition);
  const nakshatraData = NAKSHATRAS[nakshatraIndex];
  const nakshatra: NakshatraInfo = {
    name: nakshatraData.name,
    pada,
    rulingPlanet: nakshatraData.ruler,
    deity: nakshatraData.deity,
    nature: nakshatraData.nature,
    description: nakshatraData.description,
  };

  // Lucky factors based on ruling planet
  const luckyFactors: VedicLuckyFactors = {
    mantra: VEDIC_MANTRAS[rulingPlanet] ?? VEDIC_MANTRAS[nakshatra.rulingPlanet] ?? 'Om Namah Shivaya',
    gemstone: VEDIC_GEMSTONES[rulingPlanet] ?? 'Pearl (Moti)',
    metal: VEDIC_METALS[rulingPlanet] ?? 'Silver',
    direction: VEDIC_DIRECTIONS[rulingPlanet] ?? 'East',
    deity: VEDIC_DEITIES[rulingPlanet] ?? 'Lord Ganesha',
    color: VEDIC_COLORS[rulingPlanet] ?? 'White',
    number: getVedicLuckyNumber(profile.dateOfBirth),
    day: VEDIC_DAYS[rulingPlanet] ?? 'Monday',
  };

  // Unlucky factors — based on the 6th/8th lord concept (simplified)
  const oppositeIndex = (ZODIAC_ORDER.indexOf(rashi) + 6) % 12;
  const oppositeSign = ZODIAC_ORDER[oppositeIndex];
  const oppositeRuler = RASHI_RULERS[oppositeSign];

  const unluckyFactors: VedicUnluckyFactors = {
    avoidColor: VEDIC_COLORS[oppositeRuler] ?? 'Black',
    avoidDirection: VEDIC_DIRECTIONS[oppositeRuler] ?? 'South',
    avoidDay: VEDIC_DAYS[oppositeRuler] ?? 'Saturday',
    cautionPlanet: oppositeRuler,
  };

  // Dosha balance
  const doshas = calculateDoshas(profile, chart);

  return {
    rashi,
    rashiLabel,
    rashiDescription,
    rulingPlanet,
    vedicElement,
    nakshatra,
    luckyFactors,
    unluckyFactors,
    doshas,
  };
}
