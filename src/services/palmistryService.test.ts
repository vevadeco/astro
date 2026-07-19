import { describe, it, expect } from 'vitest';
import {
  validatePalmImage,
  hashImageData,
  analyzePalm,
  palmUploadErrorMessage,
  MAX_PALM_IMAGE_BYTES,
} from './palmistryService';
import type { BirthProfile } from '../models/types';

const sampleProfile: BirthProfile = {
  name: 'Test User',
  dateOfBirth: '1990-06-15',
  birthTime: '14:30',
};

function makeImageFile(size = 1024, type = 'image/png'): File {
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) bytes[i] = i % 256;
  return new File([bytes], 'palm.png', { type });
}

describe('palmistryService', () => {
  describe('validatePalmImage', () => {
    it('accepts valid PNG images under size limit', () => {
      expect(validatePalmImage(makeImageFile())).toBeNull();
    });

    it('rejects invalid file types', () => {
      const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
      expect(validatePalmImage(file)).toBe('invalid_type');
    });

    it('rejects files over 5 MB', () => {
      const file = makeImageFile(MAX_PALM_IMAGE_BYTES + 1);
      expect(validatePalmImage(file)).toBe('file_too_large');
    });
  });

  describe('palmUploadErrorMessage', () => {
    it('returns user-friendly messages for each error', () => {
      expect(palmUploadErrorMessage('invalid_type')).toContain('JPEG');
      expect(palmUploadErrorMessage('file_too_large')).toContain('5 MB');
      expect(palmUploadErrorMessage('read_failed')).toContain('try again');
    });
  });

  describe('hashImageData', () => {
    it('produces a deterministic hash for the same file', async () => {
      const file = makeImageFile(512);
      const hash1 = await hashImageData(file);
      const hash2 = await hashImageData(file);
      expect(hash1).toBe(hash2);
    });

    it('produces different hashes for different content', async () => {
      const file1 = makeImageFile(512);
      const file2 = makeImageFile(513);
      expect(await hashImageData(file1)).not.toBe(await hashImageData(file2));
    });
  });

  describe('analyzePalm', () => {
    it('returns a complete palm reading with all sections', async () => {
      const file = makeImageFile(2048);
      const reading = await analyzePalm(file, sampleProfile, 'right');

      expect(reading.handSide).toBe('right');
      expect(['Earth', 'Air', 'Fire', 'Water']).toContain(reading.handShape);
      expect(reading.handShapeDescription).toBeTruthy();
      expect(reading.lines).toHaveLength(4);
      expect(reading.mounts).toHaveLength(7);
      expect(reading.predictions).toHaveLength(5);
      expect(reading.overallSummary).toBeTruthy();
    });

    it('produces deterministic results for the same inputs', async () => {
      const file = makeImageFile(1024);
      const reading1 = await analyzePalm(file, sampleProfile, 'left');
      const reading2 = await analyzePalm(file, sampleProfile, 'left');
      expect(reading1).toEqual(reading2);
    });

    it('differs between left and right hand', async () => {
      const file = makeImageFile(1024);
      const left = await analyzePalm(file, sampleProfile, 'left');
      const right = await analyzePalm(file, sampleProfile, 'right');
      expect(left.handSide).toBe('left');
      expect(right.handSide).toBe('right');
    });

    it('includes explanations for each major line', async () => {
      const file = makeImageFile(1024);
      const reading = await analyzePalm(file, sampleProfile, 'right');
      for (const line of reading.lines) {
        expect(line.name).toBeTruthy();
        expect(line.explanation.length).toBeGreaterThan(20);
      }
    });
  });
});
