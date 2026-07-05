/**
 * Profile persistence service using browser localStorage.
 * Handles save, load, and delete operations with proper error handling.
 */

import type { BirthProfile, PersistenceError, Result } from '../models/types';

const STORAGE_KEY = 'astro_birth_profile';

/**
 * Validates that a parsed object has the shape of a BirthProfile.
 * Returns true if the object contains all required fields with correct types.
 */
function isValidBirthProfile(data: unknown): data is BirthProfile {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.name !== 'string' || obj.name.length === 0) {
    return false;
  }

  if (typeof obj.dateOfBirth !== 'string' || obj.dateOfBirth.length === 0) {
    return false;
  }

  if (typeof obj.birthTime !== 'string' || obj.birthTime.length === 0) {
    return false;
  }

  // location is optional, but if present must be a string
  if (obj.location !== undefined && typeof obj.location !== 'string') {
    return false;
  }

  return true;
}

/**
 * Profile Persistence Service
 *
 * Implements ProfilePersistenceService interface from the design document.
 * Provides save, load, and delete operations for BirthProfile with
 * proper error handling via Result type.
 */
export const profilePersistence = {
  /**
   * Serialize and save a BirthProfile to localStorage.
   * Returns Result<void, PersistenceError>.
   */
  save(profile: BirthProfile): Result<void, PersistenceError> {
    try {
      const json = JSON.stringify(profile);
      localStorage.setItem(STORAGE_KEY, json);
      return { ok: true, value: undefined };
    } catch (e: unknown) {
      // DOMException with name 'QuotaExceededError' indicates storage is full
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        return { ok: false, error: 'storage_full' };
      }
      return { ok: false, error: 'unavailable' };
    }
  },

  /**
   * Load a BirthProfile from localStorage.
   * Returns null if no profile is stored.
   * Returns corrupted_data error if stored data cannot be parsed or validated.
   */
  load(): Result<BirthProfile | null, PersistenceError> {
    let raw: string | null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      return { ok: false, error: 'unavailable' };
    }

    if (raw === null) {
      return { ok: true, value: null };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, error: 'corrupted_data' };
    }

    if (!isValidBirthProfile(parsed)) {
      return { ok: false, error: 'corrupted_data' };
    }

    return { ok: true, value: parsed };
  },

  /**
   * Remove the stored profile from localStorage.
   */
  delete(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently ignore errors on delete per design
    }
  },
};
