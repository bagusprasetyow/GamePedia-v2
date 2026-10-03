import type { FC, ReactElement } from 'react';
import type { SourceCodeBodyProps } from '../SourceCode.types';
import { CodePreview } from '../CodePreview';

/**
 * SourceCodeBody Component - Sub-Molecule Internal SourceCode
 *
 * Merender wadah blok kode dengan mendelegasikan penyorotan sintaks dan layout
 * ke molekul CodePreview yang modular.
 */
export const SourceCodeBody: FC<SourceCodeBodyProps> = ({
  code,
  maxHeight,
  className = '',
}): ReactElement => {
  return (
    <CodePreview
      code={code}
      maxHeight={maxHeight}
      className={className}
    />
  );
};

export default SourceCodeBody;
