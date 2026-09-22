import { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

interface ServerTimeData {
  timestamp: string;
  timeString: string;
  unix: number;
  jsonData?: Record<string, unknown>;
}

type SseStatus = 'connected' | 'reconnecting' | 'disconnected';

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time SSE time state
  const [serverTime, setServerTime] = useState<ServerTimeData | null>(null);
  const [sseStatus, setSseStatus] = useState<SseStatus>('disconnected');
  const [reconnectCount, setReconnectCount] = useState<number>(0);
  const [tickCount, setTickCount] = useState<number>(0);

  // Polling fetch for /api (auto update jika backend berubah)
  useEffect(() => {
    const fetchBackendMessage = () => {
      fetch('/api')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.text();
        })
        .then((data) => {
          setMessage(data);
          setError(null);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Gagal terhubung ke backend');
          setLoading(false);
        });
    };

    fetchBackendMessage();
    const intervalId = setInterval(fetchBackendMessage, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // Fungsi rekoneksi manual / instan
  const [connectTrigger, setConnectTrigger] = useState<number>(0);
  const handleManualReconnect = useCallback(() => {
    setSseStatus('reconnecting');
    setConnectTrigger((prev) => prev + 1);
  }, []);

  // Real-time SSE listener with robust auto-reconnect & online/offline handling
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const startStream = () => {
      if (eventSource) {
        eventSource.close();
      }

      setSseStatus((prev) => (prev === 'connected' ? 'reconnecting' : prev));
      eventSource = new EventSource('/api/time');

      eventSource.onopen = () => {
        setSseStatus('connected');
        setReconnectCount(0);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed: ServerTimeData = JSON.parse(event.data);
          setServerTime(parsed);
          setTickCount((prev) => prev + 1);
        } catch (err) {
          console.error('Gagal parse data SSE:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE Connection Error:', err);
        setSseStatus('reconnecting');
        setReconnectCount((prev) => prev + 1);

        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
          eventSource.close();
          if (retryTimeout) clearTimeout(retryTimeout);
          retryTimeout = setTimeout(() => {
            startStream();
          }, 3000);
        }
      };
    };

    startStream();

    const handleOnline = () => {
      console.log('Jaringan kembali online, melakukan auto-reconnect SSE...');
      startStream();
    };

    const handleOffline = () => {
      console.log('Jaringan terputus / offline');
      setSseStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connectTrigger]);

  return (
    <div
      className={cn(
        // layout
        "flex min-h-screen flex-col items-center justify-center",

        // spacing
        "p-6",

        // typography
        "font-sans",

        // background
        "bg-neutral-950",

        // text
        "text-white"
      )}
    >
      <div
        className={cn(
          // layout
          "w-full max-w-lg space-y-6 text-center",

          // spacing
          "p-8",

          // border
          "rounded-2xl border border-neutral-800",

          // background
          "bg-neutral-900",

          // shadow
          "shadow-2xl"
        )}
      >
        {/* Header with Gamepad Icon */}
        <div
          className={cn(
            // layout
            "flex flex-col items-center space-y-2"
          )}
        >
          <div
            className={cn(
              // spacing
              "p-3",

              // border
              "rounded-2xl border border-primary-500/20",

              // background
              "bg-primary-500/10",

              // text
              "text-primary-400"
            )}
          >
            <Icon icon="lucide:gamepad-2" className="h-10 w-10" />
          </div>
          <div>
            <h1
              className={cn(
                // typography
                "text-3xl font-extrabold tracking-tight",

                // text
                "text-primary-400"
              )}
            >
              GamePedia v2
            </h1>
            <p
              className={cn(
                // spacing
                "mt-1",

                // typography
                "text-sm",

                // text
                "text-neutral-400"
              )}
            >
              Real-Time Server Connection & Live Clock Check
            </p>
          </div>
        </div>

        {/* HTTP Backend Status */}
        <div
          className={cn(
            // layout
            "space-y-2",

            // spacing
            "p-4",

            // border
            "rounded-xl border border-neutral-800",

            // background
            "bg-neutral-900/80",

            // shadow
            "shadow-inner"
          )}
        >
          <div
            className={cn(
              // layout
              "flex items-center justify-between"
            )}
          >
            <div
              className={cn(
                // layout
                "flex items-center space-x-1.5",

                // typography
                "text-xs font-semibold uppercase tracking-wider",

                // text
                "text-neutral-400"
              )}
            >
              <Icon icon="lucide:server" className="h-4 w-4 text-primary-400" />
              <span>HTTP Endpoint Status</span>
            </div>
          </div>

          {loading && (
            <div
              className={cn(
                // layout
                "flex items-center justify-center space-x-2",

                // spacing
                "py-1",

                // typography
                "font-medium",

                // text
                "text-warning"
              )}
            >
              <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />
              <p className="text-sm">Memuat pesan dari backend...</p>
            </div>
          )}
          {error && (
            <div
              className={cn(
                // layout
                "flex items-center space-x-2",

                // spacing
                "p-2",

                // typography
                "font-medium",

                // border
                "rounded-lg border border-error/30",

                // background
                "bg-error/10",

                // text
                "text-error"
              )}
            >
              <Icon icon="lucide:alert-circle" className="h-5 w-5 shrink-0" />
              <div className="text-left text-xs">
                <p className="font-semibold">Koneksi HTTP Gagal</p>
                <p className="text-neutral-400">{error}</p>
              </div>
            </div>
          )}
          {!loading && !error && (
            <div
              className={cn(
                // layout
                "flex items-center justify-between",

                // spacing
                "pt-1"
              )}
            >
              <span
                className={cn(
                  // layout
                  "flex items-center space-x-1",

                  // spacing
                  "px-2.5 py-1",

                  // typography
                  "text-xs font-medium",

                  // border
                  "rounded-full border border-success/30",

                  // background
                  "bg-success/10",

                  // text
                  "text-success"
                )}
              >
                <Icon icon="lucide:check-circle-2" className="h-3.5 w-3.5" />
                <span>HTTP 200 OK</span>
              </span>
              <span
                className={cn(
                  // typography
                  "text-sm font-semibold",

                  // text
                  "text-neutral-200"
                )}
              >
                "{message}"
              </span>
            </div>
          )}
        </div>

        {/* Real-Time Server Time Stream */}
        <div
          className={cn(
            // layout
            "space-y-4",

            // spacing
            "p-6",

            // border
            "rounded-2xl border border-primary-900/50",

            // background
            "bg-linear-to-b from-primary-950/40 to-neutral-900",

            // shadow
            "shadow-lg"
          )}
        >
          <div
            className={cn(
              // layout
              "flex items-center justify-between"
            )}
          >
            <div
              className={cn(
                // layout
                "flex items-center space-x-2"
              )}
            >
              <span
                className={cn(
                  // position
                  "relative",

                  // layout
                  "flex",

                  // size
                  "h-3 w-3"
                )}
              >
                {sseStatus === 'connected' && (
                  <span
                    className={cn(
                      // position
                      "absolute inset-0",

                      // layout
                      "inline-flex",

                      // size
                      "h-full w-full",

                      // border
                      "rounded-full",

                      // background
                      "bg-success",

                      // state
                      "opacity-75",

                      // transition
                      "animate-ping"
                    )}
                  />
                )}
                {sseStatus === 'reconnecting' && (
                  <span
                    className={cn(
                      // position
                      "absolute inset-0",

                      // layout
                      "inline-flex",

                      // size
                      "h-full w-full",

                      // border
                      "rounded-full",

                      // background
                      "bg-warning",

                      // state
                      "opacity-75",

                      // transition
                      "animate-ping"
                    )}
                  />
                )}
                <span
                  className={cn(
                    // position
                    "relative",

                    // layout
                    "inline-flex",

                    // size
                    "h-3 w-3",

                    // border
                    "rounded-full",

                    // background
                    sseStatus === 'connected'
                      ? 'bg-success'
                      : sseStatus === 'reconnecting'
                      ? 'bg-warning'
                      : 'bg-error'
                  )}
                />
              </span>
              <span
                className={cn(
                  // layout
                  "flex items-center space-x-1.5",

                  // typography
                  "text-xs font-semibold uppercase tracking-wider",

                  // text
                  "text-primary-300"
                )}
              >
                <Icon icon="lucide:radio" className="h-3.5 w-3.5" />
                <span>Real-Time Stream</span>
              </span>
            </div>
            <div
              className={cn(
                // layout
                "flex items-center space-x-2"
              )}
            >
              <span
                className={cn(
                  // layout
                  "flex items-center space-x-1",

                  // spacing
                  "px-2 py-0.5",

                  // typography
                  "font-mono text-xs",

                  // border
                  "rounded border border-neutral-700",

                  // background
                  "bg-neutral-800",

                  // text
                  "text-neutral-400"
                )}
              >
                <Icon icon="lucide:activity" className="h-3 w-3 text-primary-400" />
                <span>Ticks: {tickCount}</span>
              </span>
            </div>
          </div>

          {/* Status Alert Bar */}
          {sseStatus === 'reconnecting' && (
            <div
              className={cn(
                // layout
                "flex items-center justify-between",

                // spacing
                "p-2.5",

                // typography
                "text-xs",

                // border
                "rounded-xl border border-warning/30",

                // background
                "bg-warning/10",

                // text
                "text-warning"
              )}
            >
              <div
                className={cn(
                  // layout
                  "flex items-center space-x-2"
                )}
              >
                <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin shrink-0" />
                <span>
                  Koneksi terputus. Mencoba rekoneksi otomatis...
                  {reconnectCount > 0 && ` (Percobaan #${reconnectCount})`}
                </span>
              </div>
              <button
                onClick={handleManualReconnect}
                className={cn(
                  // spacing
                  "px-2.5 py-1",

                  // typography
                  "text-[11px] font-semibold",

                  // border
                  "rounded-lg border border-warning/40",

                  // background
                  "bg-warning/20",

                  // text
                  "text-warning",

                  // interaction
                  "hover:bg-warning/30",

                  // state
                  "cursor-pointer",

                  // transition
                  "transition-colors"
                )}
              >
                Coba Sekarang
              </button>
            </div>
          )}

          {sseStatus === 'disconnected' && (
            <div
              className={cn(
                // layout
                "flex items-center justify-between",

                // spacing
                "p-2.5",

                // typography
                "text-xs",

                // border
                "rounded-xl border border-error/30",

                // background
                "bg-error/10",

                // text
                "text-error"
              )}
            >
              <div
                className={cn(
                  // layout
                  "flex items-center space-x-2"
                )}
              >
                <Icon icon="lucide:wifi-off" className="h-4 w-4 shrink-0" />
                <span>Koneksi terputus / Offline</span>
              </div>
              <button
                onClick={handleManualReconnect}
                className={cn(
                  // spacing
                  "px-2.5 py-1",

                  // typography
                  "text-[11px] font-semibold",

                  // border
                  "rounded-lg border border-error/40",

                  // background
                  "bg-error/20",

                  // text
                  "text-error",

                  // interaction
                  "hover:bg-error/30",

                  // state
                  "cursor-pointer",

                  // transition
                  "transition-colors"
                )}
              >
                Hubungkan Kembali
              </button>
            </div>
          )}

          {serverTime ? (
            <div className="space-y-3">
              {/* Digital Clock Display */}
              <div
                className={cn(
                  // layout
                  "space-y-1 text-center",

                  // spacing
                  "px-6 py-4",

                  // typography
                  "font-mono",

                  // border
                  "rounded-xl border border-primary-500/20",

                  // background
                  "bg-neutral-950/90",

                  // shadow
                  "shadow-inner"
                )}
              >
                <div
                  className={cn(
                    // layout
                    "flex items-center justify-center space-x-2"
                  )}
                >
                  <Icon
                    icon="lucide:clock"
                    className={cn(
                      // size
                      "h-6 w-6",

                      // text
                      "text-primary-400",

                      // transition / state
                      sseStatus === 'connected' ? 'animate-pulse' : 'opacity-40'
                    )}
                  />
                  <p
                    className={cn(
                      // typography
                      "text-4xl font-bold tracking-widest",

                      // text
                      "text-primary-300 drop-shadow-[0_0_10px_var(--color-primary-500)]"
                    )}
                  >
                    {serverTime.timeString}
                  </p>
                </div>
                <p className="text-xs text-neutral-400">Waktu Server Real-Time</p>
              </div>

              {/* Timestamp Metadata */}
              <div
                className={cn(
                  // layout
                  "space-y-1.5 text-left",

                  // spacing
                  "p-3",

                  // typography
                  "font-mono text-xs",

                  // border
                  "rounded-lg border border-neutral-800",

                  // background
                  "bg-neutral-950/50"
                )}
              >
                <div
                  className={cn(
                    // layout
                    "flex items-center justify-between"
                  )}
                >
                  <span
                    className={cn(
                      // layout
                      "flex items-center space-x-1.5",

                      // text
                      "text-neutral-500"
                    )}
                  >
                    <Icon icon="lucide:calendar" className="h-3.5 w-3.5 text-neutral-400" />
                    <span>ISO Timestamp:</span>
                  </span>
                  <span className="text-neutral-300">{serverTime.timestamp}</span>
                </div>
                <div
                  className={cn(
                    // layout
                    "flex items-center justify-between"
                  )}
                >
                  <span
                    className={cn(
                      // layout
                      "flex items-center space-x-1.5",

                      // text
                      "text-neutral-500"
                    )}
                  >
                    <Icon icon="lucide:timer" className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Unix Timestamp:</span>
                  </span>
                  <span className="text-neutral-300">{serverTime.unix} ms</span>
                </div>
              </div>

              {/* Live JSON Data (Live from live-data.json) */}
              {serverTime.jsonData && (
                <div
                  className={cn(
                    // layout
                    "space-y-2 text-left",

                    // spacing
                    "p-4",

                    // typography
                    "text-xs",

                    // border
                    "rounded-xl border border-primary-800/40",

                    // background
                    "bg-primary-950/40"
                  )}
                >
                  <div
                    className={cn(
                      // layout
                      "flex items-center justify-between",

                      // spacing
                      "pb-2",

                      // border
                      "border-b border-primary-800/30"
                    )}
                  >
                    <span
                      className={cn(
                        // layout
                        "flex items-center space-x-1.5",

                        // typography
                        "font-semibold uppercase tracking-wider",

                        // text
                        "text-primary-300"
                      )}
                    >
                      <Icon icon="lucide:file-json" className="h-4 w-4 text-primary-400" />
                      <span>Live JSON Data (live-data.json)</span>
                    </span>
                    <span
                      className={cn(
                        // spacing
                        "px-2 py-0.5",

                        // typography
                        "text-[10px] font-semibold",

                        // border
                        "rounded border",

                        // background & text & border
                        sseStatus === 'connected'
                          ? 'border-success/30 bg-success/20 text-success'
                          : 'border-warning/30 bg-warning/20 text-warning'
                      )}
                    >
                      {sseStatus === 'connected' ? 'LIVE SSE' : 'RECONNECTING'}
                    </span>
                  </div>
                  <pre
                    className={cn(
                      // layout
                      "overflow-x-auto",

                      // spacing
                      "p-3",

                      // typography
                      "font-mono text-[11px] leading-relaxed",

                      // border
                      "rounded-lg border border-neutral-800",

                      // background
                      "bg-neutral-950",

                      // text
                      "text-success"
                    )}
                  >
                    {JSON.stringify(serverTime.jsonData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                // layout
                "flex flex-col items-center space-y-2",

                // spacing
                "py-6"
              )}
            >
              <div
                className={cn(
                  // layout
                  "flex items-center space-x-2",

                  // typography
                  "text-sm font-medium",

                  // text
                  "text-primary-300",

                  // transition
                  "animate-pulse"
                )}
              >
                <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin text-primary-400" />
                <span>Menghubungkan ke Stream Waktu Real-Time...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
