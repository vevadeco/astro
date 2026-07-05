import type {
  BirthProfile,
  NatalChart,
  Planet,
  PlanetaryPosition,
  ZodiacSign,
} from '../models/types';
import { determineSign } from './zodiacService';
import {
  degreeToSign,
  hashString,
  normalizeDegree,
  timeToMinutes,
  dayOfYear,
} from './astroUtils';

const PLANETS: Planet[] = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
];

/** Planet-specific orbital speed factors for deterministic approximation. */
const PLANET_SPEED: Record<Planet, number> = {
  sun: 0.9856,
  moon: 13.1764,
  mercury: 4.0923,
  venus: 1.6021,
  mars: 0.524,
  jupiter: 0.0831,
  saturn: 0.0335,
};

/**
 * Computes a deterministic planetary degree from birth details.
 */
function computePlanetDegree(
  planet: Planet,
  dateOfBirth: string,
  birthTime: string,
): number {
  const doy = dayOfYear(dateOfBirth);
  const minutes = timeToMinutes(birthTime);
  const year = parseInt(dateOfBirth.slice(0, 4), 10);
  const seed = hashString(`${planet}-${dateOfBirth}-${birthTime}`);

  const base =
    doy * PLANET_SPEED[planet] +
    minutes * (PLANET_SPEED[planet] / 60) +
    (year % 30) * 12 +
    (seed % 17);

  return normalizeDegree(base);
}

/**
 * Approximates ascendant sign from birth time and location hash.
 */
function computeAscendant(
  dateOfBirth: string,
  birthTime: string,
  location: string,
): ZodiacSign {
  const minutes = timeToMinutes(birthTime);
  const locHash = hashString(location.toLowerCase().trim());
  const doy = dayOfYear(dateOfBirth);
  const degree = normalizeDegree(minutes * 0.25 + locHash % 360 + doy * 0.97);
  return degreeToSign(degree);
}

/**
 * Calculates a natal chart from a birth profile.
 * With location: full precision including ascendant.
 * Without location: reduced precision, no ascendant.
 */
export function calculate(profile: BirthProfile): NatalChart {
  const sunSign = determineSign(profile.dateOfBirth);
  const hasLocation = Boolean(profile.location && profile.location.trim());

  const planetaryPositions: PlanetaryPosition[] = PLANETS.map((planet) => {
    const degree = computePlanetDegree(planet, profile.dateOfBirth, profile.birthTime);
    return {
      planet,
      degree,
      sign: planet === 'sun' ? sunSign : degreeToSign(degree),
    };
  });

  const moonPosition =
    planetaryPositions.find((p) => p.planet === 'moon')?.degree ?? 0;

  const chart: NatalChart = {
    sunSign,
    moonPosition,
    planetaryPositions,
    reducedPrecision: !hasLocation,
  };

  if (hasLocation && profile.location) {
    chart.ascendant = computeAscendant(
      profile.dateOfBirth,
      profile.birthTime,
      profile.location,
    );
  }

  return chart;
}
