import { describe, expect, it } from 'vitest';
import {
  formatPhoneHyphens,
  getDynamicErrorMessage,
  sanitizePhone,
  validatePhoneFormat,
} from './phoneUtils';

describe('phoneUtils', () => {
  describe('formatPhoneHyphens', () => {
    it('harus memformat nomor handphone seluler (0812)', () => {
      const formatted = formatPhoneHyphens('081234567890');
      expect(formatted).toBe('0812-3456-7890');
    });

    it('harus memformat nomor darurat/shortcode 14xxx', () => {
      const formatted = formatPhoneHyphens('14045');
      expect(formatted).toBe('14045');
    });

    it('harus memformat nomor call center 1500-xxx', () => {
      const formatted = formatPhoneHyphens('1500123');
      expect(formatted).toBe('1500-123');
    });

    it('harus memformat nomor telepon rumah PSTN Jakarta (021)', () => {
      const formatted = formatPhoneHyphens('0217654321');
      expect(formatted).toBe('021-7654321');
    });

    it('harus menangani prefix +62 dengan benar', () => {
      const formatted = formatPhoneHyphens('+628123456789');
      expect(formatted).toBe('+62-628-12345678');
    });
  });

  describe('sanitizePhone', () => {
    it('harus membuang karakter non-digit kecuali + dan -', () => {
      const sanitized = sanitizePhone('0812abc3456xyz');
      expect(sanitized).toBe('0812-3456');
    });
  });

  describe('validatePhoneFormat', () => {
    it('harus memvalidasi nomor seluler dengan panjang normal (10-13 digit)', () => {
      expect(validatePhoneFormat('081234567890')).toBe(true);
      expect(validatePhoneFormat('99')).toBe(false);
    });

    it('harus memvalidasi call center 14045 (5 digit)', () => {
      expect(validatePhoneFormat('14045')).toBe(true);
      expect(validatePhoneFormat('1404')).toBe(false);
    });

    it('harus memvalidasi PSTN 021-7654321 (7-11 digit)', () => {
      expect(validatePhoneFormat('021-7654321')).toBe(true);
    });
  });

  describe('getDynamicErrorMessage', () => {
    it('harus mengembalikan pesan yang sesuai untuk nomor PSTN', () => {
      const msg = getDynamicErrorMessage('02112');
      expect(msg).toContain('PSTN');
    });

    it('harus mengembalikan pesan kustom jika disediakan', () => {
      const msg = getDynamicErrorMessage('123', { invalidErrorMessage: 'Format salah' });
      expect(msg).toBe('Format salah');
    });
  });
});
