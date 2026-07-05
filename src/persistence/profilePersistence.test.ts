import { describe, it, expect, beforeEach, vi } from 'vitest';
import { profilePersistence } from './profilePersistence';
import type { BirthProfile } from '../models/types';

const validProfile: BirthProfile = {
  name: 'Alice Smith',
  dateOfBirth: '1990-05-15',
  birthTime: '14:30',
  location: 'New York',
};

const validProfileNoLocation: BirthProfile = {
  name: 'Bob Jones',
  dateOfBirth: '1985-12-01',
  birthTime: '08:00',
};

describe('profilePersistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('save', () => {
    it('saves a valid profile successfully', () => {
      const result = profilePersistence.save(validProfile);
      expect(result).toEqual({ ok: true, value: undefined });
    });

    it('stores profile as JSON in localStorage', () => {
      profilePersistence.save(validProfile);
      const stored = localStorage.getItem('astro_birth_profile');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(validProfile);
    });

    it('saves a profile without optional location', () => {
      const result = profilePersistence.save(validProfileNoLocation);
      expect(result).toEqual({ ok: true, value: undefined });
    });

    it('returns storage_full error when QuotaExceededError is thrown', () => {
      const mockSetItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException('Storage quota exceeded', 'QuotaExceededError');
        throw error;
      });

      const result = profilePersistence.save(validProfile);
      expect(result).toEqual({ ok: false, error: 'storage_full' });

      mockSetItem.mockRestore();
    });

    it('returns unavailable error when localStorage throws non-quota error', () => {
      const mockSetItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const result = profilePersistence.save(validProfile);
      expect(result).toEqual({ ok: false, error: 'unavailable' });

      mockSetItem.mockRestore();
    });
  });

  describe('load', () => {
    it('returns null when no profile is stored', () => {
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: true, value: null });
    });

    it('loads a previously saved profile', () => {
      profilePersistence.save(validProfile);
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: true, value: validProfile });
    });

    it('loads a profile without optional location', () => {
      profilePersistence.save(validProfileNoLocation);
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: true, value: validProfileNoLocation });
    });

    it('returns corrupted_data error for invalid JSON', () => {
      localStorage.setItem('astro_birth_profile', 'not-valid-json{{{');
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: false, error: 'corrupted_data' });
    });

    it('returns corrupted_data error for JSON missing required fields', () => {
      localStorage.setItem('astro_birth_profile', JSON.stringify({ name: 'Alice' }));
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: false, error: 'corrupted_data' });
    });

    it('returns corrupted_data error for JSON with wrong field types', () => {
      localStorage.setItem(
        'astro_birth_profile',
        JSON.stringify({ name: 123, dateOfBirth: '1990-05-15', birthTime: '14:30' })
      );
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: false, error: 'corrupted_data' });
    });

    it('returns corrupted_data error when location is not a string', () => {
      localStorage.setItem(
        'astro_birth_profile',
        JSON.stringify({ name: 'Alice', dateOfBirth: '1990-05-15', birthTime: '14:30', location: 42 })
      );
      const result = profilePersistence.load();
      expect(result).toEqual({ ok: false, error: 'corrupted_data' });
    });

    it('returns unavailable when localStorage getItem throws', () => {
      const mockGetItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const result = profilePersistence.load();
      expect(result).toEqual({ ok: false, error: 'unavailable' });

      mockGetItem.mockRestore();
    });
  });

  describe('delete', () => {
    it('removes the stored profile from localStorage', () => {
      profilePersistence.save(validProfile);
      profilePersistence.delete();
      expect(localStorage.getItem('astro_birth_profile')).toBeNull();
    });

    it('does not throw when no profile is stored', () => {
      expect(() => profilePersistence.delete()).not.toThrow();
    });

    it('handles errors silently', () => {
      const mockRemoveItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(() => profilePersistence.delete()).not.toThrow();

      mockRemoveItem.mockRestore();
    });
  });

  describe('round-trip', () => {
    it('save then load produces identical profile with location', () => {
      profilePersistence.save(validProfile);
      const result = profilePersistence.load();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(validProfile);
      }
    });

    it('save then load produces identical profile without location', () => {
      profilePersistence.save(validProfileNoLocation);
      const result = profilePersistence.load();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(validProfileNoLocation);
      }
    });
  });
});
