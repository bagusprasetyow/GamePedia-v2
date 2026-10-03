import { useState, forwardRef } from "react";
import type { ChangeEvent, MouseEvent, ReactNode } from "react";
import { Button, Text } from "@/components/atoms";
import { TextInput } from "../TextInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import type { PasswordInputProps } from "./PasswordInput.types";

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

/**
 * PasswordInput Component - Molecule UI Element
 *
 * Komponen bidang masukan kata sandi (password field) berbasis `TextInput`.
 * Dilengkapi sakelar visibilitas kata sandi (mata terbuka/tertutup)
 * serta dukungan penautan opsional ke komponen terpisah `PasswordStrengthMeter`.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      mode = "login",
      showTogglePassword = true,
      showStrengthMeter,
      showRequirements = true,
      minLength = 8,
      label,
      placeholder,
      startIcon = "mdi:lock-outline",
      value,
      defaultValue,
      onChange,
      endAdornment,
      description,
      error,
      ...restProps
    },
    ref,
  ) => {
    // ─────────────────────────────────────────────────────────────
    // 2. LOGIKA: State Management, Mode Resolution & Handlers
    // ─────────────────────────────────────────────────────────────
    const isCreateMode = mode === "create" || mode === "membuat";

    // Resolusi label & placeholder (default normal: "Kata Sandi", create mode: "Buat Kata Sandi Baru")
    const resolvedLabel =
      label ?? (isCreateMode ? "Buat Kata Sandi Baru" : "Kata Sandi");
    const resolvedPlaceholder =
      placeholder ??
      (isCreateMode ? "Buat kata sandi baru..." : "Masukkan kata sandi...");

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string>(
      String(value ?? defaultValue ?? ""),
    );
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const currentValue = String(isControlled ? (value ?? "") : internalValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const toggleVisibility = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowPassword((prev) => !prev);
    };

    // Render Sakelar Visibilitas Kata Sandi (Eye / Eye-off Icon)
    const renderTogglePasswordButton = (): ReactNode => {
      if (!showTogglePassword) return null;

      return (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          iconSize="md"
          icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
          onClick={toggleVisibility}
          className="-mr-1 text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label={
            showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          }
          tabIndex={-1}
        />
      );
    };

    // End Adornment (gabungan tombol toggle & adornment kustom)
    const computedEndAdornment = (
      <div className="flex items-center gap-1 -mr-0.5">
        {endAdornment}
        {renderTogglePasswordButton()}
      </div>
    );

    // Pada mode 'login', showRequirements dan showStrengthMeter tidak ditampilkan
    const resolvedShowRequirements = isCreateMode ? showRequirements : false;
    const resolvedShowStrengthMeter = isCreateMode
      ? (showStrengthMeter ?? Boolean(resolvedShowRequirements))
      : false;
    const hasExtraFooter = Boolean(
      resolvedShowStrengthMeter || resolvedShowRequirements,
    );

    const combinedDescription = (
      <div className="w-full flex flex-col">
        {description && <Text as="span">{description}</Text>}
        {hasExtraFooter && (
          <div className="mt-2">
            <PasswordStrengthMeter
              value={currentValue}
              showMeter={resolvedShowStrengthMeter}
              showRequirements={resolvedShowRequirements}
              minLength={minLength}
            />
          </div>
        )}
      </div>
    );

    const computedErrorPosition =
      restProps.errorPosition || (hasExtraFooter ? "relative" : undefined);

    // ─────────────────────────────────────────────────────────────
    // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
    // ─────────────────────────────────────────────────────────────
    return (
      <TextInput
        ref={ref}
        type={showPassword ? "text" : "password"}
        label={resolvedLabel}
        placeholder={resolvedPlaceholder}
        startIcon={startIcon}
        endAdornment={computedEndAdornment}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        error={error}
        errorPosition={computedErrorPosition}
        description={
          hasExtraFooter || description ? combinedDescription : undefined
        }
        {...restProps}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
