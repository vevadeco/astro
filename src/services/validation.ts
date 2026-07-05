import type { BirthProfile, ValidationResult, ValidationError } from '../models/types';

/**
 * Profile validation service implementing the ProfileValidator interface.
 * Validates individual fields and complete profiles per Requirements 1.1, 1.4, 1.5, 1.6.
 */

/** Validates name: 1-100 characters, alphabetic + spaces only. */
export function validateName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
    return { valid: false, errors };
  }

  if (name.length > 100) {
    errors.push({ field: 'name', message: 'Name must not exceed 100 characters' });
  }

  if (!/^[A-Za-z ]+$/.test(name)) {
    errors.push({ field: 'name', message: 'Name must contain only alphabetic characters and spaces' });
  }

  return { valid: errors.length === 0, errors };
}

/** Validates date of birth: YYYY-MM-DD format, valid calendar date, range 1900-01-01 to today. */
export function validateDateOfBirth(dob: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!dob || dob.trim().length === 0) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
    return { valid: false, errors };
  }

  // Check YYYY-MM-DD format
  const formatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!formatRegex.test(dob)) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth must be in YYYY-MM-DD format' });
    return { valid: false, errors };
  }

  // Parse components
  const [yearStr, monthStr, dayStr] = dob.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Check valid calendar date
  const dateObj = new Date(year, month - 1, day);
  const isValidDate =
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day;

  if (!isValidDate) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is not a valid calendar date' });
    return { valid: false, errors };
  }

  // Check range: 1900-01-01 to today
  const minDate = new Date(1900, 0, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < minDate) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth must not be before 1900-01-01' });
  }

  if (dateObj > today) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth must not be in the future' });
  }

  return { valid: errors.length === 0, errors };
}

/** Validates birth time: HH:MM 24-hour format, 00:00–23:59. */
export function validateBirthTime(time: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!time || time.trim().length === 0) {
    errors.push({ field: 'birthTime', message: 'Birth time is required' });
    return { valid: false, errors };
  }

  // Check HH:MM format
  const formatRegex = /^\d{2}:\d{2}$/;
  if (!formatRegex.test(time)) {
    errors.push({ field: 'birthTime', message: 'Birth time must be in HH:MM 24-hour format' });
    return { valid: false, errors };
  }

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    errors.push({ field: 'birthTime', message: 'Birth time must be in HH:MM 24-hour format' });
  }

  return { valid: errors.length === 0, errors };
}

/** Validates location: optional field, max 200 characters. */
export function validateLocation(location: string | undefined): ValidationResult {
  const errors: ValidationError[] = [];

  // Location is optional — undefined or empty is valid
  if (location === undefined || location === '') {
    return { valid: true, errors };
  }

  if (location.length > 200) {
    errors.push({ field: 'location', message: 'Location must not exceed 200 characters' });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates an entire profile, combining all field validations.
 * Returns all errors for missing or invalid fields.
 */
export function validateProfile(profile: Partial<BirthProfile>): ValidationResult {
  const allErrors: ValidationError[] = [];

  // Validate name (required)
  if (profile.name === undefined || profile.name === null || profile.name === '') {
    allErrors.push({ field: 'name', message: 'Name is required' });
  } else {
    const nameResult = validateName(profile.name);
    allErrors.push(...nameResult.errors);
  }

  // Validate dateOfBirth (required)
  if (profile.dateOfBirth === undefined || profile.dateOfBirth === null || profile.dateOfBirth === '') {
    allErrors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
  } else {
    const dobResult = validateDateOfBirth(profile.dateOfBirth);
    allErrors.push(...dobResult.errors);
  }

  // Validate birthTime (required)
  if (profile.birthTime === undefined || profile.birthTime === null || profile.birthTime === '') {
    allErrors.push({ field: 'birthTime', message: 'Birth time is required' });
  } else {
    const timeResult = validateBirthTime(profile.birthTime);
    allErrors.push(...timeResult.errors);
  }

  // Validate location (optional)
  const locationResult = validateLocation(profile.location);
  allErrors.push(...locationResult.errors);

  return { valid: allErrors.length === 0, errors: allErrors };
}
