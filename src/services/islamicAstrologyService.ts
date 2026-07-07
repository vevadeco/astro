import type { BirthProfile, NatalChart } from '../models/types';
import { hashString, dayOfYear, timeToMinutes } from './astroUtils';

/**
 * Islamic Astrology Service
 *
 * Islamic astrology (Ilm al-Nujum) draws from the rich tradition of medieval
 * Islamic scholars who preserved and expanded upon Greek astronomical knowledge.
 * Key features include:
 * - The 28 Lunar Mansions (Manazil al-Qamar)
 * - Arabic Parts (Lots) — mathematical points derived from planetary positions
 * - Elemental temperament (Mizaj) based on Unani/Galenic medicine
 * - Abjad numerology — letter-number correspondences from Arabic script
 * - Planetary hours (Sa'at) and their rulers
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IslamicAstrologyProfile {
  lunarMansion: LunarMansion;
  arabicLot: ArabicLot;
  temperament: Temperament;
  abjadNumber: AbjadInfo;
  planetaryHour: PlanetaryHourInfo;
  luckyFactors: IslamicLuckyFactors;
  unluckyFactors: IslamicUnluckyFactors;
  spiritualGuidance: SpiritualGuidance;
}

export interface LunarMansion {
  number: number;       // 1-28
  arabicName: string;
  englishName: string;
  star: string;         // Associated star/constellation
  nature: 'Fortunate' | 'Unfortunate' | 'Mixed';
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  description: string;
  activities: string;   // What is favored during this mansion
}

export interface ArabicLot {
  name: string;
  arabicName: string;
  meaning: string;
  degree: number;
  interpretation: string;
}

export interface Temperament {
  primary: 'Sanguine' | 'Choleric' | 'Melancholic' | 'Phlegmatic';
  arabicName: string;
  qualities: string;
  balance: { hot: number; cold: number; moist: number; dry: number };
  advice: string;
}

export interface AbjadInfo {
  value: number;
  reducedValue: number;  // Single digit
  letterCorrespondence: string;
  meaning: string;
}

export interface PlanetaryHourInfo {
  planet: string;
  arabicName: string;
  quality: string;
  favoredActions: string;
}

export interface IslamicLuckyFactors {
  day: string;
  color: string;
  number: number;
  gemstone: string;
  incense: string;
  direction: string;
  angelicName: string;
  surah: string;        // Recommended Quranic chapter
}

export interface IslamicUnluckyFactors {
  avoidDay: string;
  avoidColor: string;
  avoidDirection: string;
  cautionNote: string;
}

export interface SpiritualGuidance {
  dhikr: string;        // Recommended remembrance
  bestPrayerTime: string;
  charitableAct: string;
  fastingDay: string;
}

// ─── Constants: 28 Lunar Mansions (Manazil al-Qamar) ─────────────────────────

const LUNAR_MANSIONS: Omit<LunarMansion, 'number'>[] = [
  { arabicName: 'Al-Sharatain', englishName: 'The Two Signs', star: 'β Arietis', nature: 'Mixed', element: 'Fire', description: 'Beginning of the lunar cycle. Favors bold starts and journeys.', activities: 'Starting new ventures, travel, buying livestock' },
  { arabicName: 'Al-Butain', englishName: 'The Little Belly', star: 'δ Arietis', nature: 'Unfortunate', element: 'Earth', description: 'A mansion of discord. Exercise patience and restraint.', activities: 'Digging foundations, planting seeds, solitude' },
  { arabicName: 'Al-Thurayya', englishName: 'The Pleiades', star: 'Pleiades', nature: 'Fortunate', element: 'Fire', description: 'A blessed mansion of abundance and maritime success.', activities: 'Hunting, alchemy, sailing, asking favors' },
  { arabicName: 'Al-Dabaran', englishName: 'The Follower', star: 'Aldebaran', nature: 'Mixed', element: 'Earth', description: 'Good for construction but ill for travel. Stand firm.', activities: 'Building, sowing, marriage preparations' },
  { arabicName: 'Al-Haqa', englishName: 'The White Spot', star: 'λ Orionis', nature: 'Unfortunate', element: 'Fire', description: 'A turbulent mansion. Avoid confrontation.', activities: 'Learning, study, spiritual retreat' },
  { arabicName: 'Al-Hana', englishName: 'The Mark', star: 'γ Geminorum', nature: 'Fortunate', element: 'Air', description: 'Favors love, friendship, and goodwill among people.', activities: 'Companionship, hunting, besieging enemies' },
  { arabicName: 'Al-Dhira', englishName: 'The Forearm', star: 'α Geminorum', nature: 'Fortunate', element: 'Air', description: 'Excellent for commerce, gain, and reaping harvests.', activities: 'Trade, harvesting, gaining love' },
  { arabicName: 'Al-Nathra', englishName: 'The Gap', star: 'Praesepe', nature: 'Fortunate', element: 'Water', description: 'Brings reconciliation and unity. Good for marriage.', activities: 'Love, friendship, travel, healing' },
  { arabicName: 'Al-Tarf', englishName: 'The Eye', star: 'κ Cancri', nature: 'Unfortunate', element: 'Water', description: 'A mansion of obstacles. Avoid beginning new things.', activities: 'Patience, meditation, reviewing plans' },
  { arabicName: 'Al-Jabha', englishName: 'The Forehead', star: 'α Leonis', nature: 'Fortunate', element: 'Fire', description: 'Royal mansion of victory and strengthening.', activities: 'Pursuing victory, building fortifications, love' },
  { arabicName: 'Al-Zubra', englishName: 'The Mane', star: 'δ Leonis', nature: 'Fortunate', element: 'Fire', description: 'Favors sieges, voyages, and gaining ransom.', activities: 'Voyages, trade, planting, harvesting' },
  { arabicName: 'Al-Sarfa', englishName: 'The Changer', star: 'β Leonis', nature: 'Fortunate', element: 'Fire', description: 'A turning point mansion. Good for changing circumstances.', activities: 'Planting, sowing, building, gaining freedom' },
  { arabicName: 'Al-Awwa', englishName: 'The Barker', star: 'β Virginis', nature: 'Mixed', element: 'Earth', description: 'Favors harvesting and gaining but not for travel.', activities: 'Harvesting, gaining, improving land' },
  { arabicName: 'Al-Simak', englishName: 'The Unarmed', star: 'Spica', nature: 'Fortunate', element: 'Air', description: 'Highly fortunate. Favors all good undertakings.', activities: 'Marriage, trade, travel, planting, healing' },
  { arabicName: 'Al-Ghafr', englishName: 'The Cover', star: 'ι Virginis', nature: 'Unfortunate', element: 'Earth', description: 'A hidden mansion. Good for secrets but not open action.', activities: 'Digging wells, secretive actions, finding treasures' },
  { arabicName: 'Al-Zubana', englishName: 'The Claws', star: 'α Librae', nature: 'Unfortunate', element: 'Air', description: 'A mansion of impediments. Avoid purchases.', activities: 'Spiritual work, repentance, charity' },
  { arabicName: 'Al-Iklil', englishName: 'The Crown', star: 'β Scorpionis', nature: 'Mixed', element: 'Water', description: 'A cautious mansion, but good for building and planting.', activities: 'Building, gardening, cautious progress' },
  { arabicName: 'Al-Qalb', englishName: 'The Heart', star: 'Antares', nature: 'Unfortunate', element: 'Water', description: 'Powerful but dangerous. A mansion of inner conflict.', activities: 'Defense, protection rituals, spiritual strength' },
  { arabicName: 'Al-Shaula', englishName: 'The Sting', star: 'λ Scorpii', nature: 'Unfortunate', element: 'Fire', description: 'Discord and misfortune. Practice restraint.', activities: 'Avoiding conflict, patient endurance' },
  { arabicName: 'Al-Naaim', englishName: 'The Ostriches', star: 'γ Sagittarii', nature: 'Fortunate', element: 'Fire', description: 'Good for taming and domestication. Speeds journeys.', activities: 'Taming, hunting, beginning short journeys' },
  { arabicName: 'Al-Baldah', englishName: 'The City', star: 'σ Sagittarii', nature: 'Mixed', element: 'Earth', description: 'Favors harvesting and caution in dealings.', activities: 'Harvesting, sowing, cautious trade' },
  { arabicName: 'Sad al-Dhabih', englishName: 'Lucky Star of the Slaughterer', star: 'α Capricorni', nature: 'Fortunate', element: 'Earth', description: 'Favors escape and healing. Good for freedom.', activities: 'Healing, escape from difficulty, surgery' },
  { arabicName: 'Sad Bula', englishName: 'Lucky Star of the Swallower', star: 'μ Aquarii', nature: 'Unfortunate', element: 'Air', description: 'A mansion of delay. Avoid hasty decisions.', activities: 'Patience, planning, avoiding new starts' },
  { arabicName: 'Sad al-Suud', englishName: 'Luckiest of the Lucky', star: 'β Aquarii', nature: 'Fortunate', element: 'Air', description: 'Most auspicious mansion. Favors all undertakings.', activities: 'Marriage, partnerships, trade, new ventures' },
  { arabicName: 'Sad al-Akhbiya', englishName: 'Lucky Star of Hidden Things', star: 'γ Aquarii', nature: 'Mixed', element: 'Water', description: 'Good for revenge and separation, not for unions.', activities: 'Endings, separating from harm, uncovering secrets' },
  { arabicName: 'Al-Fargh al-Awwal', englishName: 'The First Spout', star: 'α Pegasi', nature: 'Fortunate', element: 'Air', description: 'Favors union and construction. Good for marriage.', activities: 'Marriage, building, sowing, travel' },
  { arabicName: 'Al-Fargh al-Thani', englishName: 'The Second Spout', star: 'γ Pegasi', nature: 'Fortunate', element: 'Water', description: 'Excellent for trade, gain, and healing.', activities: 'Trade, harvesting, healing, marriage' },
  { arabicName: 'Batn al-Hut', englishName: 'The Belly of the Fish', star: 'β Andromedae', nature: 'Mixed', element: 'Water', description: 'Final mansion. Good for completion and harvest.', activities: 'Completing projects, harvesting, reflection' },
];

// ─── Planetary Hours ─────────────────────────────────────────────────────────

const PLANETARY_HOURS = [
  { planet: 'Saturn', arabicName: 'Zuhal', quality: 'Contemplative', favoredActions: 'Meditation, solitude, long-term planning, dealing with property' },
  { planet: 'Jupiter', arabicName: 'Mushtari', quality: 'Expansive', favoredActions: 'Religious acts, seeking knowledge, generosity, legal matters' },
  { planet: 'Mars', arabicName: 'Mirrikh', quality: 'Energetic', favoredActions: 'Physical work, courage, surgery, confronting challenges' },
  { planet: 'Sun', arabicName: 'Shams', quality: 'Illuminating', favoredActions: 'Leadership, authority matters, seeking fame, meeting rulers' },
  { planet: 'Venus', arabicName: 'Zuhara', quality: 'Harmonious', favoredActions: 'Art, beauty, marriage, socializing, wearing new clothes' },
  { planet: 'Mercury', arabicName: 'Utarid', quality: 'Intellectual', favoredActions: 'Writing, trade, learning, communication, accounting' },
  { planet: 'Moon', arabicName: 'Qamar', quality: 'Receptive', favoredActions: 'Travel by water, dreams, imagination, public affairs' },
];

// ─── Gemstones & Colors by Planet ────────────────────────────────────────────

const ISLAMIC_GEMSTONES: Record<string, string> = {
  Saturn: 'Black Onyx (Sulemani)',
  Jupiter: 'Yellow Sapphire (Yakoot Asfar)',
  Mars: 'Carnelian (Aqeeq)',
  Sun: 'Ruby (Yakoot)',
  Venus: 'Turquoise (Firoza)',
  Mercury: 'Emerald (Zumurrud)',
  Moon: 'Pearl (Lu\'lu)',
};

const ISLAMIC_COLORS: Record<string, string> = {
  Saturn: 'Black',
  Jupiter: 'Yellow/Gold',
  Mars: 'Red',
  Sun: 'Gold/Saffron',
  Venus: 'Green/White',
  Mercury: 'Mixed/Green',
  Moon: 'White/Silver',
};

const ISLAMIC_DAYS: Record<string, string> = {
  Saturn: 'Saturday',
  Jupiter: 'Thursday',
  Mars: 'Tuesday',
  Sun: 'Sunday',
  Venus: 'Friday',
  Mercury: 'Wednesday',
  Moon: 'Monday',
};

const ISLAMIC_DIRECTIONS: Record<string, string> = {
  Saturn: 'West',
  Jupiter: 'North',
  Mars: 'South',
  Sun: 'East',
  Venus: 'South-East',
  Mercury: 'North-East',
  Moon: 'North-West',
};

const ANGELIC_NAMES: Record<string, string> = {
  Saturday: 'Kasfiyail (Angel of Saturn)',
  Sunday: 'Ruqiyail (Angel of the Sun)',
  Monday: 'Jibrail (Angel of the Moon)',
  Tuesday: 'Samsamail (Angel of Mars)',
  Wednesday: 'Mikail (Angel of Mercury)',
  Thursday: 'Sarfiyail (Angel of Jupiter)',
  Friday: 'Aniyail (Angel of Venus)',
};

const SURAHS_BY_ELEMENT: Record<string, string> = {
  Fire: 'Surah Al-Shams (The Sun)',
  Earth: 'Surah At-Tin (The Fig)',
  Air: 'Surah Ar-Rahman (The Most Merciful)',
  Water: 'Surah Al-Qamar (The Moon)',
};

const INCENSE_BY_PLANET: Record<string, string> = {
  Saturn: 'Myrrh (Murr)',
  Jupiter: 'Oud/Agarwood (Oud)',
  Mars: 'Dragon\'s Blood (Dam al-Akhawain)',
  Sun: 'Frankincense (Luban)',
  Venus: 'Rose (Ward)',
  Mercury: 'Mastic (Mastika)',
  Moon: 'Camphor (Kafur)',
};

const DHIKR_BY_DAY: Record<string, string> = {
  Saturday: 'La hawla wa la quwwata illa billah (100x)',
  Sunday: 'Ya Noor (The Light) — 100x at sunrise',
  Monday: 'Ya Lateef (The Gentle) — 129x',
  Tuesday: 'Ya Qawiyy (The Strong) — 116x',
  Wednesday: 'Ya Aleem (The All-Knowing) — 150x',
  Thursday: 'Ya Razzaq (The Provider) — 308x',
  Friday: 'Salawat upon the Prophet — 100x',
};

const CHARITY_BY_ELEMENT: Record<string, string> = {
  Fire: 'Feed the hungry — provide warm meals',
  Earth: 'Plant trees or give land-related charity',
  Air: 'Support education or provide books',
  Water: 'Provide clean water or aid the thirsty',
};

const FASTING_BY_PLANET: Record<string, string> = {
  Saturn: 'Saturday (voluntary fast to ease Saturn\'s weight)',
  Jupiter: 'Thursday (Sunnah fast, Jupiter\'s day)',
  Mars: 'Tuesday (to cool Mars\' fire)',
  Sun: 'Sunday (voluntary fast)',
  Venus: 'Not recommended — Venus favors enjoyment',
  Mercury: 'Wednesday (for clarity of mind)',
  Moon: 'Monday (Sunnah fast, Moon\'s day)',
};

// ─── Calculation Functions ───────────────────────────────────────────────────

/**
 * Determines the lunar mansion based on the Moon's ecliptic longitude.
 * Each mansion spans 12°51'26" (360° / 28 = ~12.857°).
 */
function getLunarMansion(moonDegree: number): LunarMansion {
  const mansionSpan = 360 / 28;
  const index = Math.floor(moonDegree / mansionSpan) % 28;
  const data = LUNAR_MANSIONS[index];
  return { number: index + 1, ...data };
}

/**
 * Calculates the Arabic Lot of Fortune (Pars Fortunae).
 * Traditional formula: Ascendant + Moon - Sun (by day)
 * Simplified when no ascendant: Moon + birth-time-factor
 */
function calculateArabicLot(chart: NatalChart, profile: BirthProfile): ArabicLot {
  const sunDeg = chart.planetaryPositions.find(p => p.planet === 'sun')?.degree ?? 0;
  const moonDeg = chart.moonPosition;
  const minutes = timeToMinutes(profile.birthTime);

  let lotDegree: number;
  if (chart.ascendant) {
    // Use ascendant index * 30 as approximation
    const ascDeg = (['aries','taurus','gemini','cancer','leo','virgo',
      'libra','scorpio','sagittarius','capricorn','aquarius','pisces']
      .indexOf(chart.ascendant)) * 30;
    lotDegree = ((ascDeg + moonDeg - sunDeg) % 360 + 360) % 360;
  } else {
    lotDegree = ((moonDeg + (minutes / 4)) % 360 + 360) % 360;
  }

  const lotSign = Math.floor(lotDegree / 30);
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  return {
    name: 'Lot of Fortune',
    arabicName: 'Sahm al-Sa\'ada',
    meaning: 'Indicates worldly fortune, material well-being, and physical vitality',
    degree: Math.round(lotDegree * 10) / 10,
    interpretation: `Your Lot of Fortune falls in ${signs[lotSign]} at ${Math.round(lotDegree % 30)}°. This suggests your material blessings flow through ${signs[lotSign]}-related themes — ${lotSign < 6 ? 'personal action, creativity, and self-expression' : 'partnerships, shared resources, and spiritual pursuits'}.`,
  };
}

/**
 * Determines temperament (Mizaj) using Unani/Galenic system.
 * Based on birth chart elements and planetary balance.
 */
function calculateTemperament(chart: NatalChart, profile: BirthProfile): Temperament {
  const seed = hashString(`mizaj-${profile.dateOfBirth}-${profile.birthTime}`);
  const doy = dayOfYear(profile.dateOfBirth);
  const moonFactor = chart.moonPosition / 360;

  // Calculate qualities
  let hot = Math.round(((seed % 30) + doy * 0.15 + moonFactor * 20) % 100);
  let cold = Math.round(((seed % 25) + (365 - doy) * 0.12 + (1 - moonFactor) * 15) % 100);
  let moist = Math.round(((seed % 28) + moonFactor * 25 + (doy % 60)) % 100);
  let dry = Math.round(((seed % 22) + (1 - moonFactor) * 20 + ((doy + 90) % 120)) % 100);

  // Normalize
  const total = hot + cold + moist + dry;
  if (total > 0) {
    hot = Math.round((hot / total) * 100);
    cold = Math.round((cold / total) * 100);
    moist = Math.round((moist / total) * 100);
    dry = 100 - hot - cold - moist;
    if (dry < 0) { dry = 0; moist = 100 - hot - cold; }
  }

  let primary: Temperament['primary'];
  let arabicName: string;
  let qualities: string;
  let advice: string;

  if (hot >= cold && moist >= dry) {
    primary = 'Sanguine';
    arabicName = 'Damawi';
    qualities = 'Hot & Moist — joyful, sociable, optimistic, generous';
    advice = 'Balance excess enthusiasm with reflection. Avoid overindulgence in food and socializing. Cool, light foods and moderate exercise maintain your natural warmth.';
  } else if (hot >= cold && dry >= moist) {
    primary = 'Choleric';
    arabicName = 'Safrawi';
    qualities = 'Hot & Dry — ambitious, decisive, courageous, sharp-minded';
    advice = 'Channel intensity into productive work. Avoid anger and heated arguments. Cool, moist foods (cucumber, yogurt, melon) and calm environments restore balance.';
  } else if (cold >= hot && dry >= moist) {
    primary = 'Melancholic';
    arabicName = 'Sawdawi';
    qualities = 'Cold & Dry — thoughtful, careful, analytical, persistent';
    advice = 'Combat isolation with warm companionship. Avoid excessive worry and cold environments. Warming spices (saffron, cinnamon), dates, and gentle warmth lift the spirit.';
  } else {
    primary = 'Phlegmatic';
    arabicName = 'Balghami';
    qualities = 'Cold & Moist — calm, patient, steady, empathetic';
    advice = 'Stir yourself to action with gentle challenges. Avoid lethargy and excess sleep. Warming, drying foods (honey, ginger, black seed) and vigorous movement restore vitality.';
  }

  return { primary, arabicName, qualities, balance: { hot, cold, moist, dry }, advice };
}

/**
 * Calculates Abjad numerological value from birth date.
 * In Islamic tradition, each Arabic letter has a numerical value.
 * We use the birth day number reduced to a single digit.
 */
function calculateAbjad(profile: BirthProfile): AbjadInfo {
  const parts = profile.dateOfBirth.split('-');
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);

  // Full date sum
  let fullValue = day + month + (year % 100);
  const value = fullValue;

  // Reduce to single digit
  while (fullValue > 9) {
    fullValue = Math.floor(fullValue / 10) + (fullValue % 10);
  }

  const letters: Record<number, string> = {
    1: 'Alif (أ) — Unity, beginnings, divine light',
    2: 'Ba (ب) — Duality, connection, receptivity',
    3: 'Jim (ج) — Beauty, expression, creativity',
    4: 'Dal (د) — Stability, structure, foundation',
    5: 'Ha (ه) — Life breath, expansion, freedom',
    6: 'Waw (و) — Harmony, love, responsibility',
    7: 'Zay (ز) — Mystery, analysis, inner wisdom',
    8: 'Ha (ح) — Power, authority, material mastery',
    9: 'Ta (ط) — Completion, wisdom, humanitarianism',
  };

  const meanings: Record<number, string> = {
    1: 'The Leader — independent, pioneering, original',
    2: 'The Peacemaker — diplomatic, sensitive, cooperative',
    3: 'The Creator — expressive, joyful, artistic',
    4: 'The Builder — practical, reliable, disciplined',
    5: 'The Traveler — adventurous, dynamic, versatile',
    6: 'The Nurturer — caring, responsible, harmonious',
    7: 'The Seeker — spiritual, analytical, introspective',
    8: 'The Achiever — ambitious, authoritative, prosperous',
    9: 'The Sage — compassionate, wise, selfless',
  };

  return {
    value,
    reducedValue: fullValue,
    letterCorrespondence: letters[fullValue] ?? 'Alif (أ)',
    meaning: meanings[fullValue] ?? 'The Leader',
  };
}

/**
 * Determines planetary hour ruler based on birth time.
 * The Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
 */
function getPlanetaryHour(profile: BirthProfile): PlanetaryHourInfo {
  const minutes = timeToMinutes(profile.birthTime);
  // Approximate: divide day into 24 planetary hours
  const hourIndex = Math.floor(minutes / 60);
  // Day of week shifts starting planet
  const doy = dayOfYear(profile.dateOfBirth);
  const dayShift = doy % 7;
  const planetIndex = (hourIndex + dayShift) % 7;
  return PLANETARY_HOURS[planetIndex];
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Generates a complete Islamic astrology profile from birth details and natal chart.
 */
export function generateIslamicProfile(
  profile: BirthProfile,
  chart: NatalChart,
): IslamicAstrologyProfile {
  const lunarMansion = getLunarMansion(chart.moonPosition);
  const arabicLot = calculateArabicLot(chart, profile);
  const temperament = calculateTemperament(chart, profile);
  const abjadNumber = calculateAbjad(profile);
  const planetaryHour = getPlanetaryHour(profile);

  // Lucky factors based on planetary hour ruler
  const rulerPlanet = planetaryHour.planet;
  const luckyDay = ISLAMIC_DAYS[rulerPlanet] ?? 'Friday';
  const luckyFactors: IslamicLuckyFactors = {
    day: luckyDay,
    color: ISLAMIC_COLORS[rulerPlanet] ?? 'Green',
    number: abjadNumber.reducedValue,
    gemstone: ISLAMIC_GEMSTONES[rulerPlanet] ?? 'Carnelian (Aqeeq)',
    incense: INCENSE_BY_PLANET[rulerPlanet] ?? 'Frankincense (Luban)',
    direction: ISLAMIC_DIRECTIONS[rulerPlanet] ?? 'East',
    angelicName: ANGELIC_NAMES[luckyDay] ?? 'Jibrail',
    surah: SURAHS_BY_ELEMENT[lunarMansion.element] ?? 'Surah Al-Fatiha',
  };

  // Unlucky factors — opposite planet
  const oppositeIndex = (PLANETARY_HOURS.findIndex(p => p.planet === rulerPlanet) + 4) % 7;
  const oppositePlanet = PLANETARY_HOURS[oppositeIndex].planet;
  const unluckyFactors: IslamicUnluckyFactors = {
    avoidDay: ISLAMIC_DAYS[oppositePlanet] ?? 'Saturday',
    avoidColor: ISLAMIC_COLORS[oppositePlanet] ?? 'Black',
    avoidDirection: ISLAMIC_DIRECTIONS[oppositePlanet] ?? 'West',
    cautionNote: `The energy of ${oppositePlanet} (${PLANETARY_HOURS[oppositeIndex].arabicName}) creates tension with your birth chart. Exercise patience on ${ISLAMIC_DAYS[oppositePlanet]}.`,
  };

  // Spiritual guidance
  const spiritualGuidance: SpiritualGuidance = {
    dhikr: DHIKR_BY_DAY[luckyDay] ?? 'SubhanAllah, Alhamdulillah, Allahu Akbar — 33x each',
    bestPrayerTime: rulerPlanet === 'Sun' ? 'Fajr (dawn)' :
      rulerPlanet === 'Moon' ? 'Isha (night)' :
      rulerPlanet === 'Jupiter' ? 'Dhuhr (midday)' :
      rulerPlanet === 'Venus' ? 'Maghrib (sunset)' :
      rulerPlanet === 'Saturn' ? 'Asr (afternoon)' :
      rulerPlanet === 'Mars' ? 'Fajr (dawn)' : 'Tahajjud (pre-dawn)',
    charitableAct: CHARITY_BY_ELEMENT[lunarMansion.element] ?? 'Give generously to those in need',
    fastingDay: FASTING_BY_PLANET[rulerPlanet] ?? 'Monday and Thursday (Sunnah)',
  };

  return {
    lunarMansion,
    arabicLot,
    temperament,
    abjadNumber,
    planetaryHour,
    luckyFactors,
    unluckyFactors,
    spiritualGuidance,
  };
}
