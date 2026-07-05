import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateDateOfBirth,
  validateBirthTime,
  validateLocation,
  validateProfile,
} from './validation';

describe('validateName', () => {
  it('accepts a valid alphabetic name', () => {
    const result = validateName('John Doe');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a single character name', () => {
    const result = validateName('A');
    expect(result.valid).toBe(true);
  });

  it('accepts a name at max length (100 chars)', () => {
    const name = 'A'.repeat(100);
    const result = validateName(name);
    expect(result.valid).toBe(true);
  });

  it('rejects an empty string', () => {
    const result = validateName('');
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('name');
  });

  it('rejects a name exceeding 100 characters', () => {
    const name = 'A'.repeat(101);
    const result = validateName(name);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('100'))).toBe(true);
  });

  it('rejects a name with numbers', () => {
    const result = validateName('John123');
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('alphabetic'))).toBe(true);
  });

  it('rejects a name with special characters', () => {
    const result = validateName('John-Doe');
    expect(result.valid).toBe(false);
  });
});

describe('validateDateOfBirth', () => {
  it('accepts a valid date', () => {
    const result = validateDateOfBirth('1990-06-15');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts the minimum date 1900-01-01', () => {
    const result = validateDateOfBirth('1900-01-01');
    expect(result.valid).toBe(true);
  });

  it('accepts today as a date', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const result = validateDateOfBirth(`${yyyy}-${mm}-${dd}`);
    expect(result.valid).toBe(true);
  });

  it('rejects an empty string', () => {
    const result = validateDateOfBirth('');
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('dateOfBirth');
  });

  it('rejects an invalid format (DD-MM-YYYY)', () => {
    const result = validateDateOfBirth('15-06-1990');
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('YYYY-MM-DD'))).toBe(true);
  });

  it('rejects an invalid calendar date (Feb 30)', () => {
    const result = validateDateOfBirth('2020-02-30');
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('valid calendar date'))).toBe(true);
  });

  it('rejects a date before 1900-01-01', () => {
    const result = validateDateOfBirth('1899-12-31');
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('1900'))).toBe(true);
  });

  it('rejects a future date', () => {
    const result = validateDateOfBirth('2099-01-01');
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('future'))).toBe(true);
  });

  it('rejects a string with letters', () => {
    const result = validateDateOfBirth('abcd-ef-gh');
    expect(result.valid).toBe(false);
  });
});

describe('validateBirthTime', () => {
  it('accepts a valid time 00:00', () => {
    const result = validateBirthTime('00:00');
    expect(result.valid).toBe(true);
  });

  it('accepts a valid time 23:59', () => {
    const result = validateBirthTime('23:59');
    expect(result.valid).toBe(true);
  });

  it('accepts a valid time 12:30', () => {
    const result = validateBirthTime('12:30');
    expect(result.valid).toBe(true);
  });

  it('rejects an empty string', () => {
    const result = validateBirthTime('');
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('birthTime');
  });

  it('rejects an invalid format (H:MM)', () => {
    const result = validateBirthTime('9:30');
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('HH:MM'))).toBe(true);
  });

  it('rejects 24:00 (out of range)', () => {
    const result = validateBirthTime('24:00');
    expect(result.valid).toBe(false);
  });

  it('rejects 12:60 (invalid minutes)', () => {
    const result = validateBirthTime('12:60');
    expect(result.valid).toBe(false);
  });

  it('rejects a time with seconds (12:30:00)', () => {
    const result = validateBirthTime('12:30:00');
    expect(result.valid).toBe(false);
  });
});

describe('validateLocation', () => {
  it('accepts undefined (optional field)', () => {
    const result = validateLocation(undefined);
    expect(result.valid).toBe(true);
  });

  it('accepts an empty string', () => {
    const result = validateLocation('');
    expect(result.valid).toBe(true);
  });

  it('accepts a valid location', () => {
    const result = validateLocation('New York, USA');
    expect(result.valid).toBe(true);
  });

  it('accepts a location at max length (200 chars)', () => {
    const location = 'A'.repeat(200);
    const result = validateLocation(location);
    expect(result.valid).toBe(true);
  });

  it('rejects a location exceeding 200 characters', () => {
    const location = 'A'.repeat(201);
    const result = validateLocation(location);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('location');
    expect(result.errors[0].message).toContain('200');
  });
});

describe('validateProfile', () => {
  it('accepts a fully valid profile', () => {
    const result = validateProfile({
      name: 'Jane Smith',
      dateOfBirth: '1990-03-21',
      birthTime: '14:30',
      location: 'London',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a valid profile without location', () => {
    const result = validateProfile({
      name: 'Jane Smith',
      dateOfBirth: '1990-03-21',
      birthTime: '14:30',
    });
    expect(result.valid).toBe(true);
  });

  it('returns errors for all missing required fields', () => {
    const result = validateProfile({});
    expect(result.valid).toBe(false);
    const fields = result.errors.map(e => e.field);
    expect(fields).toContain('name');
    expect(fields).toContain('dateOfBirth');
    expect(fields).toContain('birthTime');
  });

  it('returns errors only for missing fields, not valid ones', () => {
    const result = validateProfile({
      name: 'Jane Smith',
      dateOfBirth: '1990-03-21',
      // birthTime missing
    });
    expect(result.valid).toBe(false);
    const fields = result.errors.map(e => e.field);
    expect(fields).toContain('birthTime');
    expect(fields).not.toContain('name');
    expect(fields).not.toContain('dateOfBirth');
  });

  it('returns errors for invalid field values', () => {
    const result = validateProfile({
      name: '123Invalid',
      dateOfBirth: 'not-a-date',
      birthTime: '99:99',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('returns location error along with other errors', () => {
    const result = validateProfile({
      name: 'Jane',
      dateOfBirth: '1990-03-21',
      birthTime: '14:30',
      location: 'A'.repeat(201),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'location')).toBe(true);
  });
});
