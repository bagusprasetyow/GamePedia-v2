# 🎬 Molekul: VideoPlayer

Komponen pemutar media video modern dan interaktif berbasis **Atomic Design** GamePedia v2. Dilengkapi antarmuka kendali taktil terenkapsulasi, integrasi **Depth System (-3 s/d 3)**, bilah penelusur waktu (timeline scrubber) dengan visualisasi buffer data, pengatur volume suara cerdas, pemilih laju kecepatan putar (playback rate), dukungan mode *Picture-in-Picture* (PiP) dan Layar Penuh (*Fullscreen*), *auto-hide controls on idle*, indikator *buffering/loading*, serta dukungan pintasan keyboard aksesibel.

---

## 📍 Lokasi Berkas & Arsitektur

- **Komponen Utama**: [`frontend/src/components/molecules/VideoPlayer/VideoPlayer.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/VideoPlayer.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/VideoPlayer/VideoPlayer.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/VideoPlayer.types.ts)
- **Hook Logika**: [`frontend/src/components/molecules/VideoPlayer/useVideoPlayer.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoPlayer.ts)
- **Styling Clsx & Helpers**: [`frontend/src/components/molecules/VideoPlayer/VideoPlayer.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/VideoPlayer.styles.ts)
- **Utilitas Helper**: [`frontend/src/components/molecules/VideoPlayer/VideoPlayer.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/VideoPlayer.utils.ts)
- **Sub-komponen Internal**:
  - Lapisan Hamparan: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerOverlay.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerOverlay.tsx)
  - Bilah Kendali Utama: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerControls.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerControls.tsx)
  - Tombol Putar/Jeda: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerPlayButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerPlayButton.tsx)
  - Tombol Lompat Durasi: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSkipButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSkipButton.tsx)
  - Scrubber Timeline: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerTimeline.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerTimeline.tsx)
  - Tampilan Durasi: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerTimeDisplay.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerTimeDisplay.tsx)
  - Pengatur Volume: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerVolume.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerVolume.tsx)
  - Pilihan Kecepatan: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerPlaybackRate.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerPlaybackRate.tsx)
  - Pengatur Resolusi (Quality): [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerQualityButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerQualityButton.tsx)
  - Teks Terjemahan (Subtitles Button): [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSubtitleButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSubtitleButton.tsx)
  - Penampil Teks Terjemahan (Subtitles View): [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSubtitles.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSubtitles.tsx)
  - Popover Pengaturan: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSettingsMenu.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerSettingsMenu.tsx)
  - Menu Konteks Klik Kanan: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerContextMenu.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerContextMenu.tsx)
  - Notifikasi HUD Feedback: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerTextInfo.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerTextInfo.tsx)
  - Layar Penuh & PiP: [`frontend/src/components/molecules/VideoPlayer/components/VideoPlayerFullscreenButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/components/VideoPlayerFullscreenButton.tsx)
- **Hooks Terenkapsulasi**:
  - Hook Utama: [`frontend/src/components/molecules/VideoPlayer/useVideoPlayer.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoPlayer.ts)
  - Gestur Klik: [`frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.ts)
  - Menu Konteks: [`frontend/src/components/molecules/VideoPlayer/useContextMenu.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useContextMenu.ts)
  - HUD Feedback: [`frontend/src/components/molecules/VideoPlayer/useTextInfo.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useTextInfo.ts)
- **Unit Test (Vitest)**:
  - [`frontend/src/components/molecules/VideoPlayer/VideoPlayer.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/VideoPlayer.spec.ts)
  - [`frontend/src/components/molecules/VideoPlayer/useVideoPlayer.spec.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoPlayer.spec.tsx)
  - [`frontend/src/components/molecules/VideoPlayer/VideoPlayer.utils.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/VideoPlayer.utils.spec.ts)
  - [`frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.spec.ts)
  - [`frontend/src/components/molecules/VideoPlayer/useContextMenu.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useContextMenu.spec.ts)
  - [`frontend/src/components/molecules/VideoPlayer/useTextInfo.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useTextInfo.spec.ts)
- **Barrel Export**: [`frontend/src/components/molecules/VideoPlayer/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/index.ts) & [`frontend/src/components/molecules/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/index.ts)

---

## ⚙️ Props & Interface (`VideoPlayerProps`)

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `src` | `string \| VideoSource[]` | `undefined` | URL berkas video tunggal, stream HLS (`.m3u8`), atau daftar array multi-format |
| `tracks` | `VideoTrackSource[]` | `[]` | Daftar track subtitle / caption WebVTT |
| `scrubbingVtt` | `string` | `undefined` | URL berkas WebVTT sprite sheet untuk pratinjau thumbnail saat hover timeline |
| `showSubtitles` | `boolean` | `true` | Menampilkan menu pemilihan subtitle / caption jika tracks tersedia |
| `defaultSubtitle` | `string` | `'off'` | Bahasa subtitle awal saat video dimuat (misal `'id'`, `'en'`, dll.) |
| `showQuality` | `boolean` | `true` | Menampilkan menu pemilihan resolusi / kualitas video (jika opsi kualitas tersedia) |
| `qualities` | `VideoQualityOption[]` | `[]` | Opsi kustom daftar resolusi / kualitas video (otomatis diisi jika HLS) |
| `defaultQuality` | `string \| number` | `-1` | Resolusi awal yang dipilih (`-1` untuk adaptif otomatis) |
| `onQualityChange` | `(id: string \| number) => void` | `undefined` | Callback saat resolusi video diganti |
| `poster` | `string` | `undefined` | URL gambar thumbnail pratinjau sebelum diputar |
| `title` | `ReactNode` | `undefined` | Judul video pada header overlay |
| `autoPlay` | `boolean` | `false` | Memutar video secara otomatis saat dimuat |
| `loop` | `boolean` | `false` | Memutar ulang video secara terus-menerus |
| `muted` | `boolean` | `false` | Menonaktifkan audio bawaan |
| `defaultVolume` | `number` | `1` | Level volume awal (0.0 s/d 1.0) |
| `preload` | `'auto' \| 'metadata' \| 'none'` | `'metadata'` | Kebijakan pra-muat media browser |
| `controls` | `boolean` | `true` | Menampilkan bilah kendali kontrol kustom |
| `aspectRatio` | `'16/9' \| '4/3' \| '1/1' \| '21/9' \| 'auto'` | `'16/9'` | Rasio aspek tampilan pemutar |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Batasan lebar maksimum kontainer |
| `variant` | `'default' \| 'card' \| 'elevated' \| 'ghost'` | `'default'` | Varian visual bingkai pemutar video |
| `depth` | `VideoPlayerDepth` (-3 s/d 3) | `1` | Kedalaman elevasi visual taktil (Depth System) |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'` | Radius kelengkungan sudut bingkai |
| `showPlaybackRate` | `boolean` | `true` | Menampilkan tombol pemilih kecepatan putar |
| `playbackRates` | `number[]` | `[0.5, 0.75, 1, 1.25, 1.5, 2]` | Daftar opsi kecepatan putar |
| `showPiP` | `boolean` | `true` | Menampilkan tombol beralih ke Picture-in-Picture |
| `showFullscreen` | `boolean` | `true` | Menampilkan tombol beralih ke Layar Penuh |
| `showVolume` | `boolean` | `true` | Menampilkan pengatur volume suara |
| `showTime` | `boolean` | `true` | Menampilkan penunjuk durasi waktu |
| `autoHideControlsDelay` | `number` | `2500` | Jeda waktu kursor diam sebelum kontrol disembunyikan (ms) |
| `enableKeyboardShortcuts` | `boolean` | `true` | Mengaktifkan pintasan tombol keyboard |
| `onPlay` | `() => void` | `undefined` | Callback saat video mulai diputar |
| `onPause` | `() => void` | `undefined` | Callback saat video dijeda |
| `onEnded` | `() => void` | `undefined` | Callback saat durasi video selesai |
| `onTimeUpdate` | `(curr: number, dur: number) => void` | `undefined` | Callback saat posisi putar berganti |
| `onVolumeChange` | `(vol: number, muted: boolean) => void` | `undefined` | Callback saat volume suara diatur |
| `onError` | `(err: MediaError \| null) => void` | `undefined` | Callback saat pemuatan media gagal |

---

## 🖱️ Gestur & Interaksi Tetikus (Mouse Gestures)

- **Klik Tunggal (Single Click)**: Putar / Jeda video (*Play / Pause*).
- **Klik Ganda (Double Click)**: Masuk ke Layar Penuh (*Fullscreen*) atau Keluar (*Exit Fullscreen*).
- **Klik Kanan (Right Click)**: Membuka menu konteks kustom (*Custom Context Menu*) dengan opsi: Pengulangan (Loop), Picture-in-Picture, Kecepatan, Subtitle, Kualitas, Salin URL Video, Salin URL pada Waktu Saat Ini, dan Reset Player.
- **Scroll Roda Tetikus saat Layar Penuh (Fullscreen Wheel Scroll)**: Scroll ke atas untuk menaikkan volume (+5%) dan scroll ke bawah untuk menurunkan volume (-5%) dengan tampilan umpan balik HUD notifikasi di pojok kiri atas.
- **Cerdas Anti-Stutter**: Menggunakan hook terenkapsulasi [`useVideoClickHandler`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.ts) dengan pembatalan timer 250ms sehingga klik ganda tidak menyebabkan pemutaran terputus (*toggle play*) atau animasi transient berkedip ganda.
- **Status Video Selesai (*Replay Overlay*)**: Ketika pemutaran mencapai akhir (`isEnded`), gambar thumbnail/poster (`poster`) otomatis dimunculkan kembali bersama tombol putar ulang besar berikon `lucide:rotate-ccw` di tengah layar untuk memutar ulang video dari awal (detik 0).

---

## ⌨️ Pintasan Keyboard Komprehensif (Keyboard Shortcuts)

Saat pemutar video sedang aktif/fokus atau dalam mode layar penuh:
- <kbd>Spasi</kbd> atau <kbd>K</kbd>: Putar / Jeda (Play / Pause)
- <kbd>F</kbd> atau <kbd>Enter</kbd>: Beralih mode Layar Penuh (Fullscreen toggle)
- <kbd>M</kbd>: Beralih status Bisu Suara (Mute toggle)
- <kbd>L</kbd>: Beralih mode Pengulangan Putar (Loop toggle)
- <kbd>C</kbd>: Hidupkan / Matikan Subtitle (Toggle) \| <kbd>Ctrl+C</kbd> / <kbd>Alt+C</kbd>: Buka Menu Pilihan Subtitle
- <kbd>P</kbd> atau <kbd>I</kbd>: Beralih mode Picture-in-Picture (PiP) \| <kbd>Ctrl+P</kbd> / <kbd>Alt+P</kbd>: Buka Menu Kecepatan
- <kbd>Ctrl+Q</kbd> atau <kbd>Alt+Q</kbd>: Buka Menu Pilihan Kualitas Resolusi
- <kbd>S</kbd>: Buka / Tutup Popover Pengaturan \| <kbd>Escape</kbd>: Tutup Pengaturan / Context Menu
- <kbd>←</kbd> (Panah Kiri): Mundur 5 detik \| <kbd>J</kbd>: Mundur 10 detik
- <kbd>→</kbd> (Panah Kanan): Maju 5 detik
- <kbd>↑</kbd> (Panah Atas): Naikkan volume (+5%)
- <kbd>↓</kbd> (Panah Bawah): Turunkan volume (-5%)
- <kbd>0</kbd> s/d <kbd>9</kbd>: Lompat langsung ke persentase durasi video (0% s/d 90%) dengan notifikasi HUD TextInfo otomatis (`Menuju [ MM:SS (X%) ]`)
- <kbd>Home</kbd>: Lompat langsung ke awal video (00:00) dengan notifikasi HUD `Awal Video`
- <kbd>End</kbd>: Lompat langsung ke akhir video dengan notifikasi HUD `Akhir Video`
- <kbd>&lt;</kbd> atau <kbd>,</kbd> (<kbd>Shift+,</kbd>): Kurangi kecepatan putar bertahap
- <kbd>&gt;</kbd> atau <kbd>.</kbd> (<kbd>Shift+.</kbd>): Tambah kecepatan putar bertahap

---

## 💡 Contoh Penggunaan
 
### 1. Video Standar MP4
```tsx
import { VideoPlayer } from '@/components/molecules';

export const TrailerSection = () => {
  return (
    <VideoPlayer
      src="/storage/video/test.mp4"
      poster="/storage/image/thumbnail/test.webp"
      title="Official Game Trailer - GamePedia 2026"
      size="lg"
      variant="card"
      depth={2}
      rounded="xl"
      aspectRatio="16/9"
    />
  );
};
```

### 2. Video Streaming HLS (.m3u8) dengan Scrubbing Sprite & Multi-Subtitles
```tsx
import { VideoPlayer } from '@/components/molecules';

export const HlsTrailerSection = () => {
  return (
    <VideoPlayer
      src="/videos/Video-Trailer/Genshin-Impact/master.m3u8"
      title="Genshin Impact - Trailer Teaser"
      poster="/storage/image/thumbnail/test.webp"
      scrubbingVtt="/videos/Video-Trailer/Genshin-Impact/scrubbing/thumbs_sprite.vtt"
      tracks={[
        {
          src: '/videos/Video-Trailer/Genshin-Impact/subtitles/id.vtt',
          label: 'Indonesia',
          srcLang: 'id',
          default: true,
        },
        {
          src: '/videos/Video-Trailer/Genshin-Impact/subtitles/en.vtt',
          label: 'English',
          srcLang: 'en',
        },
        {
          src: '/videos/Video-Trailer/Genshin-Impact/subtitles/jp.vtt',
          label: '日本語',
          srcLang: 'ja',
        },
      ]}
      defaultSubtitle="id"
      size="lg"
      variant="card"
      depth={2}
      rounded="xl"
      aspectRatio="16/9"
    />
  );
};
```
