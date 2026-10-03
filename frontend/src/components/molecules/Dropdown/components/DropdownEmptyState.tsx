import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Text } from '@/components/atoms';

export interface DropdownEmptyStateProps {
  notFoundText: string;
  className?: string;
}

/**
 * Sub-komponen visual status pencarian kosong / tidak ada hasil pada menu Dropdown.
 */
export const DropdownEmptyState: FC<DropdownEmptyStateProps> = ({
  notFoundText,
  className,
}) => {
  const emptyStateClasses = cn(
    // layout
    'flex flex-col items-center justify-center gap-1.5',
    // spacing
    'py-6 px-4',
    // typography
    'text-center select-none',
    className
  );

  return (
    <div className={emptyStateClasses}>
      <Icon
        icon="mdi:database-search-outline"
        size="lg"
        className="text-muted-foreground/60"
      />
      <Text size="xs" variant="muted">
        {notFoundText}
      </Text>
    </div>
  );
};

export default DropdownEmptyState;
