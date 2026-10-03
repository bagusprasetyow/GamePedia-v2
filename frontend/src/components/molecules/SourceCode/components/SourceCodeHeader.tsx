import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Button, Icon, Text } from '@/components/atoms';
import { Clipboard } from '@/components/molecules/Clipboard';
import type { SourceCodeHeaderProps } from '../SourceCode.types';
import {
  headerClasses,
  tabListClasses,
  getTabButtonClasses,
} from '../SourceCode.styles';

/**
 * SourceCodeHeader Component - Sub-Molecule Internal SourceCode
 *
 * Merender baris header terminal window, mencakup tab switcher bahasa,
 * judul kustom, serta tombol salin kode dengan status visual feedback.
 */
export const SourceCodeHeader: FC<SourceCodeHeaderProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  showCopyButton = true,
  copied,
  onCopy,
  copyButtonText = 'Salin Kode',
  copiedText = 'Tersalin!',
  title,
  headerActions,
  className = '',
}): ReactElement => {
  // Enkapsulasi variabel internal styling sesuai Tailwind Class Composition Standard
  const containerClasses = cn(headerClasses, className);

  const sectionClasses = cn(
    // layout
    'flex items-center gap-2'
  );

  const titleClasses = cn(
    // typography
    'font-mono',
    // text
    'text-neutral-300'
  );

  return (
    <div className={containerClasses}>
      {/* Sisi Kiri: Tab Switcher atau Judul Kustom */}
      {tabs.length > 1 ? (
        <div className={tabListClasses}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <Button
                key={tab.id}
                size="xs"
                variant="ghost"
                depth={0}
                onClick={() => onTabChange(tab.id)}
                className={getTabButtonClasses(isActive)}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      ) : title ? (
        <div className={sectionClasses}>
          {typeof title === 'string' ? (
            <Text as="span" size="xs" weight="medium" className={titleClasses}>
              {title}
            </Text>
          ) : (
            title
          )}
        </div>
      ) : tabs.length === 1 ? (
        <div className={sectionClasses}>
          <Icon icon="mdi:code-tags" size="xs" variant="primary" />
          <Text as="span" size="xs" weight="medium" className={titleClasses}>
            {tabs[0].label}
          </Text>
        </div>
      ) : (
        <div className={sectionClasses}>
          <Icon icon="mdi:code-tags" size="xs" variant="primary" />
          <Text as="span" size="xs" weight="medium" className={titleClasses}>
            Source Code
          </Text>
        </div>
      )}

      {/* Sisi Kanan: Tombol Salin Kode & Aksi Tambahan */}
      <div className={sectionClasses}>
        {headerActions}
        {showCopyButton && (
          <Clipboard
            onClick={onCopy}
            copied={copied}
            label={copyButtonText}
            copiedLabel={copiedText}
            variant="terminal"
            size="xs"
            depth={0}
          />
        )}
      </div>
    </div>
  );
};

export default SourceCodeHeader;
