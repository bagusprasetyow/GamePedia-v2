import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { SegmentedControlItemProps } from '../SegmentedControl.types';
import {
  sizeStyles,
  activeTextStyles,
  inactiveItemClasses,
  itemBaseClasses,
} from '../SegmentedControl.styles';

/**
 * SegmentedControlItem Component - Sub-Atom Internal SegmentedControl
 *
 * Merender setiap tombol opsi individual dengan semantik `role="radio"`,
 * status seleksi `aria-checked`, integrasi ikon terstandarisasi, dan roving tabindex.
 */
export const SegmentedControlItem = <T extends string | number = string>({
  option,
  isSelected,
  isDisabled,
  isFocused,
  size,
  color,
  fullWidth,
  iconSize,
  onSelect,
  onFocus,
}: SegmentedControlItemProps<T>): ReactElement => {
  const currentSize = sizeStyles[size] || sizeStyles.md;

  const itemClasses = cn(
    // position & base
    itemBaseClasses,
    'z-10',
    // layout
    fullWidth && 'flex-1',
    // size & spacing
    currentSize.item,
    // typography
    currentSize.text,
    isSelected && 'font-semibold',
    // text & variant
    isSelected ? activeTextStyles[color] : inactiveItemClasses,
    // state
    isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none'
  );

  const iconWrapperClasses = cn(
    // layout
    'inline-flex items-center justify-center shrink-0'
  );

  const renderIcon = () => {
    if (!option.icon) return null;
    if (typeof option.icon === 'string') {
      return <Icon icon={option.icon} size={iconSize} className="shrink-0" />;
    }
    return <span className={iconWrapperClasses}>{option.icon}</span>;
  };

  const accessibleName =
    option.ariaLabel || (typeof option.label === 'string' ? option.label : undefined);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={accessibleName}
      aria-disabled={isDisabled ? 'true' : undefined}
      disabled={isDisabled}
      tabIndex={isFocused ? 0 : -1}
      data-value={String(option.value)}
      data-state={isSelected ? 'active' : 'inactive'}
      className={itemClasses}
      onClick={() => {
        if (!isDisabled) {
          onSelect(option.value);
        }
      }}
      onFocus={onFocus}
    >
      {renderIcon()}
      <Text as="span" className="truncate">
        {option.label}
      </Text>
    </button>
  );
};

export default SegmentedControlItem;
