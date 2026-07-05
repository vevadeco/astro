/**
 * Core TypeScript interfaces and types for the Astrology App.
 * Shared across all layers: UI, services, persistence, and state management.
 */

// ─── Core Profile ────────────────────────────────────────────────────────────

/** User's birth profile used for all astrological calculations. */
export interface BirthProfile {
  /** 1-100 characters, alphabetic + spaces only */
  name: string;
  /** Date of birth in YYYY-MM-DD format, range 1900-01-01 to today */
  dateOfBirth: string;
  /** Birth time in HH:MM 24-hour format */
  birthTime: string;
  /** Optional location, max 200 characters */
  location?: string;
}

// ─── Zodiac ──────────────────────────────────────────────────────────────────

/** Western tropical zodiac signs. */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

// ─── Natal Chart ─────────────────────────────────────────────────────────────

/** Planets used in natal chart calculations. */
export type Planet =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn';

/** A planet's position in the natal chart. */
export interface PlanetaryPosition {
  planet: Planet;
  /** Degree position, 0-359 */
  degree: number;
  sign: ZodiacSign;
}

/** Calculated natal chart based on a user's birth profile. */
export interface NatalChart {
  sunSign: ZodiacSign;
  /** Moon position in degrees, 0-359 */
  moonPosition: number;
  /** Ascendant sign, only present when location is provided */
  ascendant?: ZodiacSign;
  planetaryPositions: PlanetaryPosition[];
  /** True when location is missing, indicating reduced calculation precision */
  reducedPrecision: boolean;
}

// ─── Lucky / Unlucky Factors ─────────────────────────────────────────────────

/** A single lucky item with its astrological explanation. */
export interface LuckyItem {
  value: string;
  /** Explanation of why this item is lucky, max 200 characters */
  explanation: string;
}

/** A single unlucky item with its astrological explanation. */
export interface UnluckyItem {
  value: string;
  /** Explanation of why this item is unfavorable, max 2 sentences */
  explanation: string;
}

/** Collection of lucky factors derived from zodiac sign and natal chart. */
export interface LuckyFactors {
  /** 1-3 lucky numbers */
  numbers: LuckyItem[];
  /** 1-3 lucky colors */
  colors: LuckyItem[];
  /** 1-2 lucky days */
  days: LuckyItem[];
  /** 1-2 lucky gemstones */
  gemstones: LuckyItem[];
}

/** Collection of unlucky factors derived from zodiac sign and natal chart. */
export interface UnluckyFactors {
  /** 1-3 unfavorable numbers */
  numbers: UnluckyItem[];
  /** 1-3 unfavorable colors */
  colors: UnluckyItem[];
  /** 1-2 unfavorable days */
  days: UnluckyItem[];
}

// ─── Calendar ────────────────────────────────────────────────────────────────

/** Classification of a date's astrological significance. */
export type DateClassification = 'lucky' | 'caution' | 'both' | 'neutral';

/** A single date with its classification for calendar display. */
export interface CalendarDate {
  /** Date in YYYY-MM-DD format */
  date: string;
  classification: DateClassification;
}

/** Calendar data for a single month. */
export interface MonthCalendarData {
  year: number;
  /** Month number, 1-12 */
  month: number;
  dates: CalendarDate[];
}

/** Detailed summary for a specific date. */
export interface DateSummary {
  /** Date in YYYY-MM-DD format */
  date: string;
  classification: DateClassification;
  /** Why the date is auspicious */
  luckySummary?: string;
  /** Why caution is advised, 50-500 characters */
  cautionSummary?: string;
}

// ─── Daily Summary ───────────────────────────────────────────────────────────

/** Today's astrological summary and guidance. */
export interface DailySummary {
  /** Date in YYYY-MM-DD format */
  date: string;
  classification: DateClassification;
  /** Guidance text for the day */
  guidance: string;
  /** Relevant lucky or unlucky factors for the day */
  relevantFactors: LuckyItem[] | UnluckyItem[];
}

// ─── Error Handling ──────────────────────────────────────────────────────────

/** Discriminated union for operations that can fail. */
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/** Possible persistence layer errors. */
export type PersistenceError = 'storage_full' | 'corrupted_data' | 'unavailable';

/** A validation error for a specific field. */
export interface ValidationError {
  field: string;
  message: string;
}

/** Result of validating a profile or field. */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
