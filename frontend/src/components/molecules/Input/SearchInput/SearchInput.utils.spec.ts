import { describe, expect, it } from 'vitest';
import { matchesSearch } from './SearchInput.utils';

describe('matchesSearch', () => {
  it('harus mengembalikan true jika query kosong', () => {
    expect(matchesSearch('GamePedia', '')).toBe(true);
    expect(matchesSearch('GamePedia', '   ')).toBe(true);
  });

  it('harus mendukung mode substring match (...x...) secara default', () => {
    expect(matchesSearch('GamePedia', 'pedia')).toBe(true);
    expect(matchesSearch('GamePedia', 'game')).toBe(true);
    expect(matchesSearch('GamePedia', 'xyz')).toBe(false);
  });

  it('harus mendukung mode prefix match (x... atau startsWith)', () => {
    expect(matchesSearch('GamePedia', 'game', 'x...')).toBe(true);
    expect(matchesSearch('GamePedia', 'pedia', 'x...')).toBe(false);
    expect(matchesSearch('GamePedia', 'game', 'startsWith')).toBe(true);
  });

  it('harus insensitif terhadap huruf besar/kecil (case insensitive)', () => {
    expect(matchesSearch('GAMEPEDIA', 'game')).toBe(true);
    expect(matchesSearch('gamepedia', 'PEDIA')).toBe(true);
  });
});
