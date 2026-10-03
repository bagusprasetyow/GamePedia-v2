import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { Button, Checkbox, Icon, Text } from '@/components/atoms';
import type { InputSize } from '@/components/atoms/Input/Input.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { DropdownOption } from '../Dropdown.types';

export interface DropdownItemProps {
  option: DropdownOption;
  isSelected: boolean;
  isHighlighted: boolean;
  isMulti: boolean;
  size: InputSize;
  sizeStyle: {
    iconSize: IconSize;
  };
  optIndex: number;
  selectOption: (option: DropdownOption) => void;
  setHighlightedIndex: (index: number) => void;
}

export const DropdownItem: FC<DropdownItemProps> = ({
  option,
  isSelected,
  isHighlighted,
  isMulti,
  size,
  sizeStyle,
  optIndex,
  selectOption,
  setHighlightedIndex,
}) => {
  // Enkapsulasi Class Variables Sesuai Standar Komposisi Tailwind
  const itemClasses = cn(
    // layout
    'w-full text-left',
    // size & spacing
    'h-auto px-2.5 py-2',
    // border
    'rounded-lg',
    // interaction
    'cursor-pointer',
    // transition
    'transition-colors',
    // state
    isHighlighted && 'bg-accent/15',
    isSelected && !isMulti && 'bg-primary/10 text-primary font-medium'
  );

  const optionContentClasses = cn(
    // layout
    'flex items-center gap-2.5 min-w-0'
  );

  const optionIconClasses = cn(
    // layout
    'shrink-0',
    // transition
    'transition-all duration-150',
    // state
    isSelected ? 'text-primary' : 'text-muted-foreground'
  );

  return (
    <Button
      type="button"
      role="option"
      aria-selected={isSelected}
      variant="ghost"
      depth={0}
      size="sm"
      justify="between"
      disabled={option.disabled}
      onClick={() => selectOption(option)}
      onMouseEnter={() => setHighlightedIndex(optIndex)}
      className={itemClasses}
    >
      <div className={optionContentClasses}>
        {isMulti && (
          <Checkbox
            checked={isSelected}
            size="sm"
            disabled={option.disabled}
            tabIndex={-1}
            className="pointer-events-none shrink-0"
          />
        )}

        {option.icon && (
          <Icon
            icon={option.icon}
            size={option.description ? (size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md') : sizeStyle.iconSize}
            className={optionIconClasses}
          />
        )}

        <div className="flex flex-col min-w-0">
          <Text
            size="sm"
            weight={isSelected ? 'semibold' : 'normal'}
            className={cn('truncate', isSelected && !isMulti && 'text-primary')}
          >
            {option.label}
          </Text>
          {option.description && (
            <Text size="xs" variant="muted" className="truncate">
              {option.description}
            </Text>
          )}
        </div>
      </div>
    </Button>
  );
};

export default DropdownItem;
