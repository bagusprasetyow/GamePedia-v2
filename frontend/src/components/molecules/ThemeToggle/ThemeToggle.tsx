import type { FC, ReactElement } from 'react';
import { loadIcons } from '@iconify/react';
import { Button, Switch } from '@/components/atoms';
import { useTheme } from '@/hooks/useTheme';
import type { SwitchSize, SwitchVariant } from '@/components/atoms/Switch/Switch.types';
import type { ThemeToggleProps } from './ThemeToggle.types';

// Pre-load kedua ikon ke memory cache agar pergantian tema instan tanpa jeda download network
loadIcons(['mdi:weather-sunny', 'mdi:weather-night']);

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
const iconNameMap = {
  dark: 'mdi:weather-sunny',
  light: 'mdi:weather-night',
};

const switchSizeMap: Record<string, SwitchSize> = {
  '2xs': 'sm',
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

const validSwitchVariants: SwitchVariant[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'error',
  'info',
];

/**
 * ThemeToggle Component - Molecule UI
 * 
 * Komponen tombol sakelar tema cerdas yang terhubung dengan manajemen tema global
 * dan persistensi localStorage.
 * 
 * @param {ThemeToggleDisplay} [props.display='icon'] - Mode tampilan ('icon', 'button', atau 'switch')
 * @param {ButtonSize} [props.size='md'] - Ukuran tombol / switch
 * @param {ButtonVariant} [props.variant='primary'] - Varian gaya tombol
 * @param {ButtonDepth} [props.depth] - Tingkat kedalaman tombol / trek switch
 * @param {ButtonRounded} [props.rounded='full'] - Kelengkungan sudut
 * @param {string} [props.className] - Class kustom tambahan
 * 
 * @returns {ReactElement} Elemen tombol atau switch pengubah tema
 */
export const ThemeToggle: FC<ThemeToggleProps> = ({
  display = 'icon',
  size = 'md',
  variant = 'primary',
  depth,
  rounded = 'full',
  showIcon = false,
  className = '',
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const { isDark, toggleTheme } = useTheme();

  const currentIcon = isDark ? iconNameMap.dark : iconNameMap.light;
  const labelText = isDark ? 'Mode Terang' : 'Mode Gelap';
  const ariaLabel = `Ubah ke ${labelText}`;

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  if (display === 'switch') {
    const switchSize = switchSizeMap[size] || 'md';
    const switchVariant: SwitchVariant = validSwitchVariants.includes(variant as SwitchVariant)
      ? (variant as SwitchVariant)
      : 'primary';

    return (
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        size={switchSize}
        variant={switchVariant}
        depth={depth}
        thumbCheckedIcon={showIcon ? "mdi:weather-night" : undefined}
        thumbUncheckedIcon={showIcon ? "mdi:weather-sunny" : undefined}
        aria-label={ariaLabel}
        className={className}
      />
    );
  }

  if (display === 'button') {
    return (
      <Button
        variant={variant}
        depth={depth}
        size={size}
        rounded={rounded}
        startIcon={currentIcon}
        onClick={toggleTheme}
        aria-label={ariaLabel}
        className={className}
      >
        {labelText}
      </Button>
    );
  }

  return (
    <Button
      icon={currentIcon}
      variant={variant}
      depth={depth}
      size={size}
      rounded={rounded}
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={className}
    />
  );
};

export default ThemeToggle;
