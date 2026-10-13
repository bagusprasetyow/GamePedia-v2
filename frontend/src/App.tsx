import type { FC, ReactElement } from 'react';
import { Text, Badge, Icon } from '@/components/atoms';
import { VideoPlayer, ThemeToggle } from '@/components/molecules';

/**
 * App Component - Root Application Entry
 *
 * Menampilkan antarmuka pemutar media GamePedia memutar berkas video test.mp4
 * dari backend storage dengan dukungan streaming chunked HTTP 206 Partial Content.
 */
export const App: FC = (): ReactElement => {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      {/* 1. Header Navigasi Atas */}
      <header className="flex items-center justify-between border-b border-border/60 px-6 py-4 backdrop-blur-md bg-background/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-1">
            <Icon icon="lucide:play-square" size="lg" />
          </div>
          <div className="flex flex-col">
            <Text as="h1" size="lg" weight="bold" className="leading-tight tracking-tight">
              GamePedia
            </Text>
            <Text as="p" size="xs" variant="muted">
              Media Streamer & Video Player
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" size="sm" startIcon="lucide:server">
            Backend Port 4003
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      {/* 2. Area Konten Utama Pemutar Video */}
      <section className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-6">
        {/* Wadah VideoPlayer */}
        <div className="w-full flex justify-center">
          <VideoPlayer
            src="/storage/video/Genshin-Impact/master.m3u8"
            title="Genshin Impact - Trailer Teaser"
            poster="/storage/image/thumbnail/Genshin-mpact.jpg"
            scrubbingVtt="/storage/video/Genshin-Impact/scrubbing/thumbs_sprite.vtt"
            tracks={[
              {
                src: '/storage/video/Genshin-Impact/subtitles/id.vtt',
                label: 'Indonesia',
                srcLang: 'id',
              },
              {
                src: '/storage/video/Genshin-Impact/subtitles/en.vtt',
                label: 'English',
                srcLang: 'en',
              },
              {
                src: '/storage/video/Genshin-Impact/subtitles/jp.vtt',
                label: '日本語',
                srcLang: 'ja',
              },
            ]}
            defaultSubtitle="off"
            variant="card"
            depth={-1}
            size="lg"
            rounded="xl"
            aspectRatio="16/9"
            showPlaybackRate={true}
            showSubtitles={true}
            showQuality={true}
            showFullscreen={true}
            showVolume={true}
            showTime={true}
            enableKeyboardShortcuts={true}
          />
        </div>

        {/* 3. Panel Informasi & Metadata Berkas */}
        <div className="w-full max-w-4xl rounded-2xl border border-border/80 bg-card p-5 shadow-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Text as="h2" size="base" weight="semibold">
                Genshin Impact
              </Text>
              <Badge appearance="tint" variant="primary" size="xs">
                HLS Stream (.m3u8)
              </Badge>
              <Badge appearance="outline" variant="secondary" size="xs">
                Multi-Resolution (1080p - 360p)
              </Badge>
              <Badge appearance="outline" variant="secondary" size="xs">
                Scrubbing Sprite
              </Badge>
              <Badge appearance="outline" variant="secondary" size="xs">
                3 Subtitles (ID, EN, JA)
              </Badge>
            </div>
            <Text as="p" size="xs" variant="muted">
              Dialirkan secara langsung dari <code className="px-1 py-0.5 rounded bg-muted font-mono text-[11px]">data/storage/video/Genshin-Impact</code> dengan dukungan HLS adaptive streaming (1080p, 720p, 480p, 360p), sprite sheet timeline preview, dan WebVTT captions.
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
