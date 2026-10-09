import type { FC, ReactElement } from 'react';
import type { ImageAmbientBlurProps } from '../Image.types';
import { getAmbientBlurClasses } from '../Image.styles';

/**
 * ImageAmbientBlur Component - Sub-Atom Internal Image
 *
 * Menampilkan salinan gambar yang dikaburkan (blur) sebagai efek cahaya ambient di lapisan belakang.
 */
export const ImageAmbientBlur: FC<ImageAmbientBlurProps> = ({
  src,
  className = '',
}): ReactElement => {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={getAmbientBlurClasses(className)}
    />
  );
};
