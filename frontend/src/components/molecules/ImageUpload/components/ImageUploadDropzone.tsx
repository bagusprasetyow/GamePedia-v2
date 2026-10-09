import type { FC, ReactElement, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Button, Icon, Text } from "@/components/atoms";
import type { ImageUploadDropzoneProps } from "../ImageUpload.types";
import {
  dropzoneIconSizeMap,
  getDropzoneClasses,
  getDropzoneIconWrapperClasses,
} from "../ImageUpload.styles";

/**
 * ImageUploadDropzone Component - Sub-Atom Internal ImageUpload
 *
 * Menampilkan area interaktif drag-and-drop dan pemilih berkas gambar
 * dengan indikasi visual saat file diseret melintasi area.
 */
export const ImageUploadDropzone: FC<ImageUploadDropzoneProps> = ({
  icon,
  title,
  subtitle,
  size,
  disabled,
  isDragging,
  onBrowse,
}): ReactElement => {
  const iconSize = dropzoneIconSizeMap[size] || "3xl";

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onBrowse();
    }
  };

  const textContainerClasses = cn(
    // layout
    "flex flex-col items-center gap-1",
    // size
    "max-w-sm",
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Area unggah gambar"
      aria-disabled={disabled}
      onClick={disabled ? undefined : onBrowse}
      onKeyDown={handleKeyDown}
      className={getDropzoneClasses({ isDragging, disabled })}
    >
      <div className={getDropzoneIconWrapperClasses(isDragging)}>
        <Icon icon={icon} size={iconSize} />
      </div>

      <div className={textContainerClasses}>
        <Text
          as="p"
          size="sm"
          weight="semibold"
          variant={isDragging ? "primary" : "default"}
        >
          {title}
        </Text>
        {subtitle && (
          <Text as="p" size="xs" variant="muted">
            {subtitle}
          </Text>
        )}
      </div>

      <div className="mt-1">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          depth={0}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onBrowse();
          }}
          startIcon="lucide:folder-open"
        >
          Pilih Berkas
        </Button>
      </div>
    </div>
  );
};
