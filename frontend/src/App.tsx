import type { FC, ReactElement } from 'react';
import { useState } from 'react';
import { Button, Text } from '@/components/atoms';
import { ImageUpload, ThemeToggle, formatFileSize } from '@/components/molecules';
import { uploadImageToServer } from '@/utils/image';

/**
 * App Component - Root Application Entry
 *
 * Menampilkan demo interaktif pengunggahan berkas gambar menggunakan molekul ImageUpload
 * terpadu dengan aksi unggah ke root (/) backend storage.
 */
export const App: FC = (): ReactElement => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    filename: string;
    size: number;
    url: string;
  } | null>(null);

  /**
   * Mengunggah berkas gambar yang dipilih ke direktori root (/) penyimpanan backend
   */
  const handleUploadToRoot = async (): Promise<void> => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setSuccessInfo(null);

    try {
      const response = await uploadImageToServer({
        file,
        path: '/',
        onProgress: (percent) => setUploadProgress(percent),
      });

      setSuccessInfo({
        filename: response.data.filename,
        size: response.data.size,
        url: response.data.url,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah gambar ke server';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset state ketika memilih berkas baru atau menghapus gambar
   */
  const handleFileChange = (newFile: File | null, newUrl: string | null): void => {
    setFile(newFile);
    setImageUrl(newUrl);
    setUploadError(null);
    setSuccessInfo(null);
    setUploadProgress(0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <Text as="h1" size="xl" weight="bold">
            GamePedia
          </Text>
          <Text as="p" size="xs" variant="muted">
            Demo Pengunggahan Berkas Gambar
          </Text>
        </div>
        <ThemeToggle />
      </header>

      <section className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-4">
          <ImageUpload
            label="Upload Gambar"
            description="Otomatis dikonversi ke format WebP dan ukuran < 100 KB"
            accept="image/png, image/jpeg, image/webp, image/gif"
            maxSizeMB={10}
            aspectRatio="video"
            variant="dashed"
            depth={-1}
            convertTo="webp"
            compress={{ maxSizeKB: 100 }}
            value={imageUrl}
            isUploading={isUploading}
            progress={uploadProgress}
            error={uploadError || undefined}
            success={Boolean(successInfo)}
            onChange={handleFileChange}
          />

          <Button
            variant="primary"
            width="full"
            startIcon="lucide:upload"
            isLoading={isUploading}
            loadingText="Mengunggah ke root (/)..."
            disabled={!file || isUploading}
            onClick={handleUploadToRoot}
          >
            Upload ke Root (/)
          </Button>

          {successInfo && (
            <div className="rounded-lg border border-success/30 bg-success/10 p-3 space-y-1">
              <Text as="p" size="sm" weight="semibold" variant="success">
                Gambar berhasil diunggah ke root (/)!
              </Text>
              <Text as="p" size="xs" variant="muted" className="break-all">
                Nama Berkas:{' '}
                <Text as="span" weight="medium" variant="default">
                  {successInfo.filename}
                </Text>{' '}
                ({formatFileSize(successInfo.size)})
              </Text>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default App;
