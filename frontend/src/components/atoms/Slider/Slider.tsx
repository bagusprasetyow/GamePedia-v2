import {
  useState,
  useRef,
  useId,
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { ReactElement, CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { SliderProps } from './Slider.types';
import {
  clampSliderValue,
  snapSliderValue,
  valueToPercentage,
  getPointerValue,
  getNextValue,
  getPreviousValue,
  getPageUpValue,
  getPageDownValue,
  normalizeRange,
} from './Slider.utils';
import { SliderTrack } from './components/SliderTrack';
import { SliderRange } from './components/SliderRange';
import { SliderThumb } from './components/SliderThumb';
import { SliderMarks } from './components/SliderMarks';
import { SliderLabel } from './components/SliderLabel';
import { SliderHelperText } from './components/SliderHelperText';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Styling Variables & Class Maps
// (Didefinisikan dan diekspor secara modular di Slider.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Slider Component - Atomic UI Element
 *
 * Komponen penggeser nilai interaktif untuk GamePedia-v2 Design System.
 * Mendukung Single-Value Slider maupun Range Slider (dual-thumb [min, max]),
 * Depth System (-3 s/d 3), orientasi horizontal/vertikal, arah normal/reverse,
 * controlled/uncontrolled mode, pointer drag, keyboard navigation, dan aksesibilitas ARIA.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>((props, ref): ReactElement => {
  const {
    min: rawMin = 0,
    max: rawMax = 100,
    step: rawStep = 1,
    orientation = 'horizontal',
    direction = 'normal',
    size = 'md',
    color = 'primary',
    depth = -1,
    label,
    description,
    error,
    success = false,
    errorPosition = 'absolute',
    required = false,
    disabled = false,
    fullWidth = true,
    width,
    showValue = false,
    valuePosition = 'tooltip',
    formatValue,
    tooltip = false,
    getAriaValueText,
    marks,
    marksClickable = true,
    trackClickable = true,
    thumbIcon,
    wrapperClassName = '',
    className = '',
    id,
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': consumerAriaLabelledby,
    'aria-describedby': consumerAriaDescribedby,
    minDistance = 0,
    allowCross = false,
  } = props;

  const isRange = Boolean(props.range);

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State, Normalisasi, & Handlers
  // ─────────────────────────────────────────────────────────────
  const generatedId = useId();
  const sliderId = id || generatedId;
  const labelId = `${sliderId}-label`;
  const descId = `${sliderId}-desc`;
  const errorId = `${sliderId}-error`;

  const { min, max, step } = normalizeRange(rawMin, rawMax, rawStep);

  const innerInputRef = useRef<HTMLInputElement | null>(null);
  const trackElementRef = useRef<HTMLDivElement | null>(null);

  const assignRef = useCallback(
    (node: HTMLInputElement | null) => {
      innerInputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  // Normalisasi Nilai Awal untuk Single dan Range
  const isControlled = props.value !== undefined;

  // Single Value State
  const initialSingle = props.defaultValue !== undefined && typeof props.defaultValue === 'number'
    ? props.defaultValue
    : min;
  const [internalSingle, setInternalSingle] = useState<number>(() =>
    snapSliderValue(initialSingle, min, max, step)
  );

  // Range Value State [number, number]
  const initialRange: [number, number] = Array.isArray(props.defaultValue)
    ? [
        snapSliderValue(props.defaultValue[0], min, max, step),
        snapSliderValue(props.defaultValue[1], min, max, step),
      ]
    : [min, max];
  const [internalRange, setInternalRange] = useState<[number, number]>(initialRange);

  // Active Value Resolver
  const activeSingle: number = isControlled && typeof props.value === 'number'
    ? clampSliderValue(props.value, min, max)
    : internalSingle;

  const propValue = props.value;
  const activeRange: [number, number] = useMemo(() => {
    if (isControlled && Array.isArray(propValue)) {
      return [
        clampSliderValue(propValue[0], min, max),
        clampSliderValue(propValue[1], min, max),
      ];
    }
    return internalRange;
  }, [isControlled, propValue, min, max, internalRange]);

  // Refs untuk sinkronisasi di window listeners
  const activeSingleRef = useRef<number>(activeSingle);
  const activeRangeRef = useRef<[number, number]>(activeRange);
  useEffect(() => {
    activeSingleRef.current = activeSingle;
    activeRangeRef.current = activeRange;
  }, [activeSingle, activeRange]);

  // Interactivity States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggingThumbIndex, setDraggingThumbIndex] = useState<number>(0);
  const draggingThumbRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [focusedThumbIndex, setFocusedThumbIndex] = useState<number | null>(null);

  // Update Single Value
  const updateSingleValue = useCallback(
    (nextVal: number, triggerEnd = false) => {
      const snapped = snapSliderValue(nextVal, min, max, step);
      if (snapped !== activeSingleRef.current) {
        if (!isControlled) {
          setInternalSingle(snapped);
        }
        activeSingleRef.current = snapped;
        if (!isRange) {
          (props.onChange as ((val: number) => void) | undefined)?.(snapped);
        }
      }
      if (triggerEnd && !isRange) {
        (props.onChangeEnd as ((val: number) => void) | undefined)?.(snapped);
      }
    },
    [isControlled, isRange, min, max, step, props.onChange, props.onChangeEnd]
  );

  // Update Range Value
  const updateRangeValue = useCallback(
    (nextVal: number, thumbIndex: 0 | 1, triggerEnd = false) => {
      const current = [...activeRangeRef.current] as [number, number];
      let boundedVal = nextVal;

      if (!allowCross) {
        if (thumbIndex === 0) {
          boundedVal = Math.min(nextVal, current[1] - minDistance);
        } else {
          boundedVal = Math.max(nextVal, current[0] + minDistance);
        }
      }

      const clamped = clampSliderValue(boundedVal, min, max);
      const snapped = snapSliderValue(clamped, min, max, step);

      if (snapped !== current[thumbIndex]) {
        current[thumbIndex] = snapped;
        if (!isControlled) {
          setInternalRange(current);
        }
        activeRangeRef.current = current;
        if (isRange) {
          (props.onChange as ((val: [number, number]) => void) | undefined)?.(current);
        }
      }
      if (triggerEnd && isRange) {
        (props.onChangeEnd as ((val: [number, number]) => void) | undefined)?.(current);
      }
    },
    [allowCross, minDistance, min, max, step, isControlled, isRange, props.onChange, props.onChangeEnd]
  );

  // Refs untuk sinkronisasi nilai terbaru di window listeners tanpa memicu re-subscribe
  const latestPropsRef = useRef({
    min,
    max,
    step,
    orientation,
    direction,
    allowCross,
    minDistance,
    isRange,
    isControlled,
    onChange: props.onChange,
    onChangeEnd: props.onChangeEnd,
  });

  useEffect(() => {
    latestPropsRef.current = {
      min,
      max,
      step,
      orientation,
      direction,
      allowCross,
      minDistance,
      isRange,
      isControlled,
      onChange: props.onChange,
      onChangeEnd: props.onChangeEnd,
    };
  });

  const startDragging = useCallback(
    (e: ReactPointerEvent, thumbIdx: number) => {
      if (disabled) return;
      e.preventDefault();
      setDraggingThumbIndex(thumbIdx);
      draggingThumbRef.current = thumbIdx;
      setIsDragging(true);
    },
    [disabled]
  );

  // Window listener aktif terus-menerus selama isDragging tanpa terlepas oleh re-render
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!trackElementRef.current) return;
      const rect = trackElementRef.current.getBoundingClientRect();
      const p = latestPropsRef.current;
      const pointerVal = getPointerValue({
        clientX: e.clientX,
        clientY: e.clientY,
        rect,
        min: p.min,
        max: p.max,
        step: p.step,
        orientation: p.orientation,
        direction: p.direction,
      });

      if (p.isRange) {
        updateRangeValue(pointerVal, draggingThumbRef.current as 0 | 1);
      } else {
        updateSingleValue(pointerVal);
      }
    };

    const onPointerUp = () => {
      setIsDragging(false);
      const p = latestPropsRef.current;
      if (p.isRange) {
        (p.onChangeEnd as ((val: [number, number]) => void) | undefined)?.(activeRangeRef.current);
      } else {
        (p.onChangeEnd as ((val: number) => void) | undefined)?.(activeSingleRef.current);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDragging, updateRangeValue, updateSingleValue]);

  // Handler Klik pada Trek
  const handleTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (trackClickable && trackElementRef.current) {
      const rect = trackElementRef.current.getBoundingClientRect();
      const pointerVal = getPointerValue({
        clientX: e.clientX,
        clientY: e.clientY,
        rect,
        min,
        max,
        step,
        orientation,
        direction,
      });

      let chosenThumb = 0;
      if (isRange) {
        const dist0 = Math.abs(pointerVal - activeRangeRef.current[0]);
        const dist1 = Math.abs(pointerVal - activeRangeRef.current[1]);
        chosenThumb = dist0 <= dist1 ? 0 : 1;
        updateRangeValue(pointerVal, chosenThumb as 0 | 1);
      } else {
        updateSingleValue(pointerVal);
      }
      startDragging(e, chosenThumb);
    } else {
      startDragging(e, 0);
    }
  };

  // Keyboard Navigation
  const handleThumbKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, thumbIdx: number) => {
    if (disabled) return;

    const currentVal = isRange ? activeRange[thumbIdx] : activeSingle;
    let handled = false;
    let nextValue = currentVal;

    const isReverse = direction === 'reverse';

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        handled = true;
        nextValue = isReverse
          ? getPreviousValue(currentVal, step, min, max)
          : getNextValue(currentVal, step, min, max);
        break;

      case 'ArrowLeft':
      case 'ArrowDown':
        handled = true;
        nextValue = isReverse
          ? getNextValue(currentVal, step, min, max)
          : getPreviousValue(currentVal, step, min, max);
        break;

      case 'Home':
        handled = true;
        nextValue = isReverse ? max : min;
        break;

      case 'End':
        handled = true;
        nextValue = isReverse ? min : max;
        break;

      case 'PageUp':
        handled = true;
        nextValue = isReverse
          ? getPageDownValue(currentVal, step, min, max)
          : getPageUpValue(currentVal, step, min, max);
        break;

      case 'PageDown':
        handled = true;
        nextValue = isReverse
          ? getPageUpValue(currentVal, step, min, max)
          : getPageDownValue(currentVal, step, min, max);
        break;

      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      if (isRange) {
        updateRangeValue(nextValue, thumbIdx as 0 | 1, true);
      } else {
        updateSingleValue(nextValue, true);
      }
    }
  };

  // Status Validasi & Aksesibilitas
  const hasError = Boolean(error);
  const isSuccess = Boolean(success) && !hasError;

  const ariaDescribedBy = [
    hasError ? errorId : null,
    description ? descId : null,
    consumerAriaDescribedby,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabelledBy = [
    label ? labelId : null,
    consumerAriaLabelledby,
  ]
    .filter(Boolean)
    .join(' ');

  // Resolusi Lebar Kontainer
  const containerWidthStyle: CSSProperties | undefined = width
    ? {
        width: width === 'full' ? '100%' : width === 'auto' ? 'auto' : width,
      }
    : undefined;

  const outerWrapperClasses = cn(
    // layout
    'relative flex select-none',
    orientation === 'vertical' ? 'flex-col items-center h-full' : 'flex-col',
    // size
    fullWidth && !width ? 'w-full' : 'w-auto',
    // state
    disabled && 'cursor-not-allowed opacity-60',
    wrapperClassName
  );

  const trackWrapperClasses = cn(
    // layout
    'relative flex items-center justify-center py-2',
    orientation === 'vertical' ? 'h-full flex-col px-2' : 'w-full'
  );

  // Formatted Display Value
  const formattedDisplayValue = isRange
    ? formatValue
      ? `${formatValue(activeRange[0])} - ${formatValue(activeRange[1])}`
      : `${activeRange[0]} - ${activeRange[1]}`
    : formatValue
      ? formatValue(activeSingle)
      : activeSingle;

  // Persentase Posisi
  const singlePct = valueToPercentage(activeSingle, min, max, direction);
  const rangePct0 = valueToPercentage(activeRange[0], min, max, direction);
  const rangePct1 = valueToPercentage(activeRange[1], min, max, direction);

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Structured Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      style={containerWidthStyle}
      className={outerWrapperClasses}
      onMouseEnter={() => {
        if (!isDragging) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isDragging) setIsHovered(false);
      }}
    >
      {/* 3.1 Label Teks & Nilai Atas */}
      <SliderLabel
        id={labelId}
        htmlFor={sliderId}
        label={label}
        required={required}
        showValue={showValue && valuePosition === 'top'}
        formattedValue={formattedDisplayValue}
      />

      {/* 3.2 Trek Slider Interaktif */}
      <div
        ref={trackElementRef}
        className={trackWrapperClasses}
      >
        <SliderTrack
          orientation={orientation}
          size={size}
          depth={depth}
          disabled={disabled}
          hasError={hasError}
          isSuccess={isSuccess}
          trackClickable={trackClickable}
          onTrackPointerDown={handleTrackPointerDown}
          className={className}
        >
          {/* Bilah Aktif (Range Fill) */}
          <SliderRange
            startPercentage={isRange ? rangePct0 : 0}
            endPercentage={isRange ? rangePct1 : singlePct}
            orientation={orientation}
            direction={direction}
            color={color}
            disabled={disabled}
            hasError={hasError}
            isSuccess={isSuccess}
          />

          {/* Titik Penanda (Marks & Labels) */}
          {marks && (
            <SliderMarks
              marks={marks}
              min={min}
              max={max}
              orientation={orientation}
              direction={direction}
              size={size}
              currentValue={isRange ? activeRange : activeSingle}
              disabled={disabled}
              marksClickable={marksClickable}
              onMarkClick={(markVal) => {
                if (isRange) {
                  const dist0 = Math.abs(markVal - activeRange[0]);
                  const dist1 = Math.abs(markVal - activeRange[1]);
                  updateRangeValue(markVal, dist0 <= dist1 ? 0 : 1, true);
                } else {
                  updateSingleValue(markVal, true);
                }
              }}
            />
          )}

          {/* Knop Interaktif (Thumb) */}
          {isRange ? (
            <>
              {/* Knop Pertama (Min Thumb) */}
              <SliderThumb
                thumbIndex={0}
                percentage={rangePct0}
                value={activeRange[0]}
                min={min}
                max={max}
                step={step}
                orientation={orientation}
                direction={direction}
                size={size}
                color={color}
                disabled={disabled}
                hasError={hasError}
                isSuccess={isSuccess}
                thumbIcon={thumbIcon}
                tooltip={tooltip}
                showValueTooltip={showValue && valuePosition === 'tooltip'}
                formatValue={formatValue}
                getAriaValueText={(val) => (getAriaValueText ? getAriaValueText(val, 0) : String(val))}
                isDragging={isDragging && draggingThumbIndex === 0}
                isOtherDragging={isDragging && draggingThumbIndex !== 0}
                isHovered={isHovered}
                isFocused={focusedThumbIndex === 0}
                onThumbPointerDown={(e) => {
                  e.stopPropagation();
                  startDragging(e, 0);
                }}
                onThumbKeyDown={(e) => handleThumbKeyDown(e, 0)}
                onThumbFocus={() => setFocusedThumbIndex(0)}
                onThumbBlur={() => setFocusedThumbIndex(null)}
                onThumbMouseEnter={() => {
                  if (!isDragging) setIsHovered(true);
                }}
                onThumbMouseLeave={() => {
                  if (!isDragging) setIsHovered(false);
                }}
                ariaLabel={ariaLabel ? `${ariaLabel} minimum` : 'Batas minimum'}
                ariaLabelledBy={ariaLabelledBy || undefined}
                ariaDescribedBy={ariaDescribedBy || undefined}
              />

              {/* Knop Kedua (Max Thumb) */}
              <SliderThumb
                thumbIndex={1}
                percentage={rangePct1}
                value={activeRange[1]}
                min={min}
                max={max}
                step={step}
                orientation={orientation}
                direction={direction}
                size={size}
                color={color}
                disabled={disabled}
                hasError={hasError}
                isSuccess={isSuccess}
                thumbIcon={thumbIcon}
                tooltip={tooltip}
                showValueTooltip={showValue && valuePosition === 'tooltip'}
                formatValue={formatValue}
                getAriaValueText={(val) => (getAriaValueText ? getAriaValueText(val, 1) : String(val))}
                isDragging={isDragging && draggingThumbIndex === 1}
                isOtherDragging={isDragging && draggingThumbIndex !== 1}
                isHovered={isHovered}
                isFocused={focusedThumbIndex === 1}
                onThumbPointerDown={(e) => {
                  e.stopPropagation();
                  startDragging(e, 1);
                }}
                onThumbKeyDown={(e) => handleThumbKeyDown(e, 1)}
                onThumbFocus={() => setFocusedThumbIndex(1)}
                onThumbBlur={() => setFocusedThumbIndex(null)}
                onThumbMouseEnter={() => {
                  if (!isDragging) setIsHovered(true);
                }}
                onThumbMouseLeave={() => {
                  if (!isDragging) setIsHovered(false);
                }}
                ariaLabel={ariaLabel ? `${ariaLabel} maksimum` : 'Batas maksimum'}
                ariaLabelledBy={ariaLabelledBy || undefined}
                ariaDescribedBy={ariaDescribedBy || undefined}
              />
            </>
          ) : (
            /* Single Thumb */
            <SliderThumb
              thumbIndex={0}
              percentage={singlePct}
              value={activeSingle}
              min={min}
              max={max}
              step={step}
              orientation={orientation}
              direction={direction}
              size={size}
              color={color}
              disabled={disabled}
              hasError={hasError}
              isSuccess={isSuccess}
              thumbIcon={thumbIcon}
              tooltip={tooltip}
              showValueTooltip={showValue && valuePosition === 'tooltip'}
              formatValue={formatValue}
              getAriaValueText={(val) => (getAriaValueText ? getAriaValueText(val, 0) : String(val))}
              isDragging={isDragging}
              isOtherDragging={false}
              isHovered={isHovered}
              isFocused={focusedThumbIndex === 0}
              onThumbPointerDown={(e) => {
                e.stopPropagation();
                startDragging(e, 0);
              }}
              onThumbKeyDown={(e) => handleThumbKeyDown(e, 0)}
              onThumbFocus={() => setFocusedThumbIndex(0)}
              onThumbBlur={() => setFocusedThumbIndex(null)}
              onThumbMouseEnter={() => {
                if (!isDragging) setIsHovered(true);
              }}
              onThumbMouseLeave={() => {
                if (!isDragging) setIsHovered(false);
              }}
              ariaLabel={ariaLabel}
              ariaLabelledBy={ariaLabelledBy || undefined}
              ariaDescribedBy={ariaDescribedBy || undefined}
            />
          )}
        </SliderTrack>
      </div>

      {/* 3.3 Nilai Bawah (Bottom Value Display) */}
      {showValue && valuePosition === 'bottom' && (
        <Text
          as="div"
          size="xs"
          variant="muted"
          weight="medium"
          className="mt-1 flex justify-center font-mono"
        >
          {formattedDisplayValue}
        </Text>
      )}

      {/* 3.4 Keterangan Deskripsi & Pesan Error */}
      <SliderHelperText
        error={error}
        description={description}
        errorId={errorId}
        descId={descId}
        errorPosition={errorPosition}
      />

      {/* 3.5 Native Hidden Range Input untuk Aksesibilitas Form Submission */}
      {isRange ? (
        <>
          <input
            ref={assignRef}
            type="range"
            id={`${sliderId}-0`}
            name={name ? `${name}[0]` : undefined}
            min={min}
            max={max}
            step={step}
            value={activeRange[0]}
            disabled={disabled}
            required={required}
            aria-hidden="true"
            tabIndex={-1}
            className="sr-only"
            readOnly
          />
          <input
            type="range"
            id={`${sliderId}-1`}
            name={name ? `${name}[1]` : undefined}
            min={min}
            max={max}
            step={step}
            value={activeRange[1]}
            disabled={disabled}
            required={required}
            aria-hidden="true"
            tabIndex={-1}
            className="sr-only"
            readOnly
          />
        </>
      ) : (
        <input
          ref={assignRef}
          type="range"
          id={sliderId}
          name={name}
          min={min}
          max={max}
          step={step}
          value={activeSingle}
          disabled={disabled}
          required={required}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          readOnly
        />
      )}
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;
