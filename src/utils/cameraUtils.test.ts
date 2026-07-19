import { describe, it, expect } from 'vitest';
import { isCameraSupported } from './cameraUtils';

describe('cameraUtils', () => {
  describe('isCameraSupported', () => {
    it('returns a boolean', () => {
      expect(typeof isCameraSupported()).toBe('boolean');
    });
  });
});
