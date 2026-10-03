import { useState } from 'react';
import {
  Text,
  Button,
  Icon,
  Dot,
  Switch,
} from '@/components/atoms';
import { ThemeToggle } from '@/components/molecules';
import type {
  DotVariant,
  DotSize,
  DotDepth,
} from '@/components/atoms';

export default function App() {
  // ── Dot Interactive Playground State ──
  const [dotVariant, setDotVariant] = useState<DotVariant>('success');
  const [dotSize, setDotSize] = useState<DotSize>('md');
  const [dotDepth, setDotDepth] = useState<DotDepth>(0);
  const [hasPing, setHasPing] = useState(true);
  const [hasPulse, setHasPulse] = useState(false);
  const [hasGlow, setHasGlow] = useState(false);
  const [isBordered, setIsBordered] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [labelPosition, setLabelPosition] = useState<'right' | 'left'>('right');

  const dotVariants: { name: DotVariant; label: string }[] = [
    { name: 'success', label: 'Success (Online)' },
    { name: 'primary', label: 'Primary (In Match)' },
    { name: 'accent', label: 'Accent (Cyber Cyan)' },
    { name: 'secondary', label: 'Secondary (Violet)' },
    { name: 'warning', label: 'Warning (Away)' },
    { name: 'error', label: 'Error (Busy / DND)' },
    { name: 'info', label: 'Info (Update)' },
    { name: 'neutral', label: 'Neutral (Offline)' },
    { name: 'contrast', label: 'Contrast' },
    { name: 'white', label: 'White' },
  ];

  const dotSizes: DotSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

  const dotDepths: { value: DotDepth; label: string }[] = [
    { value: -3, label: '-3 Cekung Dalam' },
    { value: -2, label: '-2 Cekung Sedang' },
    { value: -1, label: '-1 Cekung Dangkal' },
    { value: 0, label: '0 Rata (Flat)' },
    { value: 1, label: '1 Timbul Rendah' },
    { value: 2, label: '2 Timbul Sedang' },
    { value: 3, label: '3 Timbul Tinggi' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <Icon icon="mdi:circle-slice-8" size="xl" variant="primary" />
          <div className="flex items-center gap-2">
            <Text as="h1" size="lg" weight="bold" variant="primary">
              GamePedia UI
            </Text>
            <Text
              as="span"
              size="xs"
              variant="muted"
              className="border border-border/80 px-2.5 py-0.5 rounded-full font-medium"
            >
              Dot Atom Showcase
            </Text>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle display="switch" size="md" />
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* SECTION 1: Interactive Playground */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2 flex flex-col gap-6">
          <div>
            <Text as="h2" size="base" weight="semibold">
              1. Playground Interaktif Dot
            </Text>
            <Text as="p" size="xs" variant="muted">
              Eksplorasi kombinasi varian warna semantik, skala ukuran, Depth System (-3 s/d 3), efek animasi (ping/pulse/glow), bordered ring, serta teks label pendamping.
            </Text>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border/80 bg-muted/20 min-h-36">
            <Dot
              variant={dotVariant}
              size={dotSize}
              depth={dotDepth}
              ping={hasPing}
              pulse={hasPulse}
              glow={hasGlow}
              bordered={isBordered}
              invisible={isInvisible}
              label={showLabel ? `Status: ${dotVariant.toUpperCase()}` : undefined}
              labelPosition={labelPosition}
            />
            {isInvisible && (
              <Text as="p" size="xs" variant="muted" className="mt-3 italic">
                (Dot sedang disembunyikan via prop invisible=true)
              </Text>
            )}
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Variant Selector */}
            <div className="flex flex-col gap-2">
              <Text as="span" size="xs" weight="semibold">
                Varian Warna Semantik
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {dotVariants.map((v) => (
                  <Button
                    key={v.name}
                    size="xs"
                    variant={dotVariant === v.name ? 'primary' : 'outline'}
                    onClick={() => setDotVariant(v.name)}
                    className="capitalize"
                  >
                    {v.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-2">
              <Text as="span" size="xs" weight="semibold">
                Skala Ukuran (Size)
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {dotSizes.map((s) => (
                  <Button
                    key={s}
                    size="xs"
                    variant={dotSize === s ? 'primary' : 'outline'}
                    onClick={() => setDotSize(s)}
                    className="uppercase"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Depth System Selector */}
            <div className="flex flex-col gap-2">
              <Text as="span" size="xs" weight="semibold">
                Depth System (-3 s/d 3)
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {dotDepths.map((d) => (
                  <Button
                    key={String(d.value)}
                    size="xs"
                    variant={dotDepth === d.value ? 'primary' : 'outline'}
                    onClick={() => setDotDepth(d.value)}
                  >
                    {d.value}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/40">
            <Switch
              checked={hasPing}
              onCheckedChange={setHasPing}
              size="sm"
              label="Ping Halo"
              description="Gelombang berdenyut"
            />
            <Switch
              checked={hasPulse}
              onCheckedChange={setHasPulse}
              size="sm"
              label="Pulse Fade"
              description="Berkedip perlahan"
            />
            <Switch
              checked={hasGlow}
              onCheckedChange={setHasGlow}
              size="sm"
              label="Neon Glow"
              description="Ambient light pendaran"
            />
            <Switch
              checked={isBordered}
              onCheckedChange={setIsBordered}
              size="sm"
              label="Bordered Ring"
              description="Cincin pembatas kontras"
            />
            <Switch
              checked={isInvisible}
              onCheckedChange={setIsInvisible}
              size="sm"
              label="Invisible"
              description="Sembunyikan titik dot"
            />
            <Switch
              checked={showLabel}
              onCheckedChange={setShowLabel}
              size="sm"
              label="Teks Label"
              description="Menampilkan teks status"
            />
            {showLabel && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => setLabelPosition((p) => (p === 'right' ? 'left' : 'right'))}
                startIcon="mdi:swap-horizontal"
              >
                Posisi: {labelPosition === 'right' ? 'Kanan' : 'Kiri'}
              </Button>
            )}
          </div>
        </section>

        {/* SECTION 2: Semantic Variants & Gaming Presets */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2 flex flex-col gap-4">
          <div>
            <Text as="h2" size="base" weight="semibold">
              2. Status Komunitas & Gaming Presets
            </Text>
            <Text as="p" size="xs" variant="muted">
              Kombinasi standar varian warna semantik untuk status gamer, sistem, dan server di GamePedia.
            </Text>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="success" size="sm" ping />
                <div>
                  <Text as="span" size="sm" weight="semibold">Online / Aktif</Text>
                  <Text as="p" size="xs" variant="muted">Tersedia untuk bermain</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">success</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="primary" size="sm" ping />
                <div>
                  <Text as="span" size="sm" weight="semibold">In Match / Bermain</Text>
                  <Text as="p" size="xs" variant="muted">Sedang di ranked match</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">primary</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="warning" size="sm" />
                <div>
                  <Text as="span" size="sm" weight="semibold">Away / AFK</Text>
                  <Text as="p" size="xs" variant="muted">Tidak aktif sementara</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">warning</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="error" size="sm" />
                <div>
                  <Text as="span" size="sm" weight="semibold">Busy / DND</Text>
                  <Text as="p" size="xs" variant="muted">Jangan diganggu</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">error</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="accent" size="sm" glow />
                <div>
                  <Text as="span" size="sm" weight="semibold">Live Broadcast</Text>
                  <Text as="p" size="xs" variant="muted">Streaming tayang</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">accent</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="neutral" size="sm" />
                <div>
                  <Text as="span" size="sm" weight="semibold">Offline</Text>
                  <Text as="p" size="xs" variant="muted">Terakhir aktif 2 jam lalu</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">neutral</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="secondary" size="sm" pulse />
                <div>
                  <Text as="span" size="sm" weight="semibold">In Party / Lobby</Text>
                  <Text as="p" size="xs" variant="muted">Menunggu antrian regu</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">secondary</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="info" size="sm" />
                <div>
                  <Text as="span" size="sm" weight="semibold">Update Ready</Text>
                  <Text as="p" size="xs" variant="muted">Patch baru tersedia</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">info</Text>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Dot variant="contrast" size="sm" />
                <div>
                  <Text as="span" size="sm" weight="semibold">High Contrast</Text>
                  <Text as="p" size="xs" variant="muted">Penegasan visibilitas</Text>
                </div>
              </div>
              <Text as="span" size="xs" variant="muted" className="font-mono">contrast</Text>
            </div>
          </div>
        </section>

        {/* SECTION 3: Physical Size Scale */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2 flex flex-col gap-4">
          <div>
            <Text as="h2" size="base" weight="semibold">
              3. Skala Ukuran Fisik Preset (2xs s/d xl)
            </Text>
            <Text as="p" size="xs" variant="muted">
              Ukuran proporsional dari yang terkecil (6px) hingga terbesar (16px) dengan ukuran teks label yang menyesuaikan secara otomatis.
            </Text>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            {dotSizes.map((size) => (
              <div
                key={size}
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 text-center"
              >
                <Text as="span" size="xs" weight="bold" variant="muted" className="uppercase">
                  Size {size}
                </Text>
                <div className="flex items-center justify-center h-8">
                  <Dot variant="primary" size={size} />
                </div>
                <Dot variant="success" size={size} label="Aktif" />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Depth System (-3 s/d 3) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2 flex flex-col gap-4">
          <div>
            <Text as="h2" size="base" weight="semibold">
              4. Standar Sistem Kedalaman UI — Depth Scale (-3 s/d 3)
            </Text>
            <Text as="p" size="xs" variant="muted">
              Elevasi bayangan visual dari cekung (-3 s/d -1), rata (0), hingga timbul (1 s/d 3).
            </Text>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {dotDepths.map((d) => (
              <div
                key={String(d.value)}
                className="flex flex-col items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-muted/30"
              >
                <Text as="span" size="xs" weight="bold" variant="muted">
                  depth={d.value}
                </Text>
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border/60">
                  <Dot variant="primary" size="lg" depth={d.value} />
                </div>
                <Text as="span" size="xs" className="text-center font-medium">
                  Level {d.value}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Animation Effects Comparison */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2 flex flex-col gap-4">
          <div>
            <Text as="h2" size="base" weight="semibold">
              5. Animasi & Efek Visual
            </Text>
            <Text as="p" size="xs" variant="muted">
              Perbandingan visual antara mode normal, ping ripple halo, slow pulse, neon glow, dan kombinasi ping + glow.
            </Text>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <Dot variant="success" size="md" />
              <Text as="span" size="xs" weight="semibold">Static Normal</Text>
            </div>

            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <Dot variant="success" size="md" ping />
              <Text as="span" size="xs" weight="semibold">Ping Ripple</Text>
            </div>

            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <Dot variant="warning" size="md" pulse />
              <Text as="span" size="xs" weight="semibold">Slow Pulse</Text>
            </div>

            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <Dot variant="accent" size="md" glow />
              <Text as="span" size="xs" weight="semibold">Neon Glow</Text>
            </div>

            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <Dot variant="error" size="md" ping glow />
              <Text as="span" size="xs" weight="semibold">Ping + Glow</Text>
            </div>
          </div>
        </section>

        {/* SECTION 6: Overlay Anchor Mode */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2 flex flex-col gap-4">
          <div>
            <Text as="h2" size="base" weight="semibold">
              6. Overlay Anchor Mode (Avatar, Button, & Icon)
            </Text>
            <Text as="p" size="xs" variant="muted">
              Membungkus elemen anak (`children`) dengan penempatan koordinat presisi (top-right, top-left, bottom-right, bottom-left) dan ring pemisah kontras (`bordered`).
            </Text>
          </div>

          <div className="flex flex-wrap gap-8 items-center pt-2">
            {/* Avatar with Status Dot */}
            <Dot variant="success" size="md" ping bordered placement="bottom-right">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-sm text-primary">
                GP
              </div>
            </Dot>

            {/* Avatar with In-Match Dot */}
            <Dot variant="primary" size="md" ping bordered placement="top-right">
              <div className="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center font-bold text-sm text-secondary-foreground">
                RX
              </div>
            </Dot>

            {/* Button with notification dot */}
            <Dot variant="error" size="sm" ping bordered placement="top-right">
              <Button variant="outline" size="sm" startIcon="mdi:bell-outline">
                Notifikasi
              </Button>
            </Dot>

            {/* Icon with unread dot */}
            <Dot variant="accent" size="sm" glow placement="top-right">
              <div className="p-2.5 rounded-xl border border-border bg-card text-foreground flex items-center justify-center">
                <Icon icon="mdi:message-text-outline" size="md" />
              </div>
            </Dot>

            {/* Gamepad button with status dot */}
            <Dot variant="success" size="sm" placement="bottom-right">
              <Button variant="secondary" size="sm" startIcon="mdi:gamepad-variant">
                Controller Siap
              </Button>
            </Dot>
          </div>
        </section>
      </main>
    </div>
  );
}
