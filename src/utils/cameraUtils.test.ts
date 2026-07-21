import { describe, it, expect } from 'vitest';
import {
  isCameraSupported,
  cameraAccessErrorMessage,
  parseCameraAccessError,
} from './cameraUtils';

describe('cameraUtils', () => {
  describe('isCameraSupported', () => {
    it('returns a boolean', () => {
      expect(typeof isCameraSupported()).toBe('boolean');
    });
  });

  describe('cameraAccessErrorMessage', () => {
    it('returns helpful messages for each error type', () => {
      expect(cameraAccessErrorMessage('denied')).toContain('permission');
      expect(cameraAccessErrorMessage('unavailable')).toContain('unavailable');
      expect(cameraAccessErrorMessage('not_supported')).toContain('browser');
    });
  });

  describe('parseCameraAccessError', () => {
    it('parses known error messages', () => {
      expect(parseCameraAccessError(new Error('denied'))).toBe('denied');
    });

    it('defaults to unavailable for unknown errors', () => {
      expect(parseCameraAccessError(new Error('other'))).toBe('unavailable');
    });
  });
});
