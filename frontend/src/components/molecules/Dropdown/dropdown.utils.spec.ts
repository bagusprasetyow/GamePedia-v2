import { describe, expect, it } from 'vitest';
import {
  createDropdownOptionsMap,
  filterDropdownOptions,
  groupDropdownOptions,
} from './dropdown.utils';
import type { DropdownOption } from './Dropdown.types';

describe('dropdown.utils', () => {
  const mockOptions: DropdownOption<string>[] = [
    { label: 'Option Alpha', value: 'alpha', group: 'Group A', description: 'First option' },
    { label: 'Option Beta', value: 'beta', group: 'Group A', description: 'Second option' },
    { label: 'Gamma Item', value: 'gamma', group: 'Group B' },
    { label: 'Delta Extra', value: 'delta' },
  ];

  describe('filterDropdownOptions', () => {
    it('harus mengembalikan seluruh opsi jika query kosong', () => {
      const filtered = filterDropdownOptions(mockOptions, '', '...x...');
      expect(filtered).toHaveLength(4);
    });

    it('harus memfilter opsi berdasarkan label', () => {
      const filtered = filterDropdownOptions(mockOptions, 'Alpha', '...x...');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe('alpha');
    });

    it('harus memfilter opsi berdasarkan description', () => {
      const filtered = filterDropdownOptions(mockOptions, 'Second', '...x...');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe('beta');
    });
  });

  describe('groupDropdownOptions', () => {
    it('harus mengelompokkan opsi berdasar properti group dan ungrouped', () => {
      const { groups, ungrouped } = groupDropdownOptions(mockOptions);
      expect(Object.keys(groups)).toEqual(['Group A', 'Group B']);
      expect(groups['Group A']).toHaveLength(2);
      expect(ungrouped).toHaveLength(1);
      expect(ungrouped[0].value).toBe('delta');
    });
  });

  describe('createDropdownOptionsMap', () => {
    it('harus membuat Map lookup dengan value sebagai key', () => {
      const map = createDropdownOptionsMap(mockOptions);
      expect(map.get('alpha')).toEqual(mockOptions[0]);
      expect(map.get('gamma')).toEqual(mockOptions[2]);
      expect(map.get('nonexistent')).toBeUndefined();
    });
  });
});
