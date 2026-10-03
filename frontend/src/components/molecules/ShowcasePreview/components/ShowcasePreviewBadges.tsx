import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { ShowcasePreviewBadgesProps, ShowcasePreviewBadgeVariant } from '../ShowcasePreview.types';
import { badgeVariantClasses, normalizeBadges } from '../ShowcasePreview.styles';

/**
 * ShowcasePreviewBadges Component - Sub-Atom Internal ShowcasePreview
 *
 * Menampilkan baris indikator props aktif berupa pill badge monospace
 * pada pojok kanan atas kanvas ShowcasePreview.
 *
 * @param {ShowcasePreviewBadgesProps} props - Properti komponen
 * @returns {ReactElement | null} Elemen barisan badge atau null bila kosong
 */
export const ShowcasePreviewBadges: FC<ShowcasePreviewBadgesProps> = ({
  badges,
  badgesNode,
  className = '',
}): ReactElement | null => {
  if (badgesNode) {
    return (
      <div
        className={cn(
          'absolute top-3 right-4 hidden sm:flex items-center gap-1.5 flex-wrap justify-end max-w-md',
          className
        )}
      >
        {badgesNode}
      </div>
    );
  }

  const items = normalizeBadges(badges);
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute top-3 right-4 hidden sm:flex items-center gap-1.5 flex-wrap justify-end max-w-md',
        className
      )}
    >
      {items.map((item, index) => {
        const safeVariant: ShowcasePreviewBadgeVariant = item.variant && badgeVariantClasses[item.variant]
          ? item.variant
          : 'default';
        const variantClass = badgeVariantClasses[safeVariant];

        // Format teks: jika ada label tampilkan label="val" (atau label={val} jika bukan string)
        let formattedText: string;
        if (item.label) {
          if (typeof item.value === 'string' && (item.value.startsWith('"') || item.value.startsWith("'"))) {
            formattedText = `${item.label}=${item.value}`;
          } else if (typeof item.value === 'string') {
            formattedText = `${item.label}="${item.value}"`;
          } else {
            formattedText = `${item.label}={${String(item.value)}}`;
          }
        } else {
          formattedText = String(item.value);
        }

        return (
          <Text
            key={`${item.label ?? ''}-${index}`}
            as="span"
            size="xs"
            className={cn(
              'font-mono px-2 py-0.5 rounded border transition-colors',
              variantClass
            )}
          >
            {formattedText}
          </Text>
        );
      })}
    </div>
  );
};

export default ShowcasePreviewBadges;
