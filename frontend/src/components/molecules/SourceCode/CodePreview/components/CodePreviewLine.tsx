import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { CodePreviewLineProps } from '../CodePreview.types';
import { renderHighlightedLine } from '../CodePreview.utils';
import { lineNumberClasses } from '../CodePreview.styles';

/**
 * CodePreviewLine Component - Sub-Molecule Internal CodePreview
 *
 * Merender satu baris kode dengan penomoran baris opsional dan penyorotan sintaks tokenik.
 */
export const CodePreviewLine: FC<CodePreviewLineProps> = ({
  line,
  lineIndex,
  showLineNumber = false,
  className = '',
}): ReactElement => {
  const lineContent = renderHighlightedLine(line, lineIndex);

  if (!showLineNumber) {
    if (!className) {
      return lineContent;
    }
    const singleLineClasses = cn(
      // size
      'min-h-5',
      className
    );
    return (
      <Text as="div" className={singleLineClasses}>
        {lineContent}
      </Text>
    );
  }

  const rowClasses = cn(
    // layout
    'flex items-baseline',
    // size
    'min-h-5',
    className
  );

  const lineWrapperClasses = cn(
    // layout
    'flex-1 overflow-x-visible'
  );

  return (
    <Text as="div" className={rowClasses}>
      <Text
        as="span"
        size="xs"
        variant="muted"
        className={lineNumberClasses}
        aria-hidden="true"
      >
        {lineIndex + 1}
      </Text>
      <Text as="div" className={lineWrapperClasses}>
        {lineContent}
      </Text>
    </Text>
  );
};

export default CodePreviewLine;
