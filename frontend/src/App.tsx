import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface ServerTimeData {
  timestamp: string;
  timeString: string;
  unix: number;
}

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time SSE time state
  const [serverTime, setServerTime] = useState<ServerTimeData | null>(null);
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [sseError, setSseError] = useState<string | null>(null);
  const [tickCount, setTickCount] = useState<number>(0);

  // Initial fetch for /api
  useEffect(() => {
    fetch('/api')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then((data) => {
        setMessage(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Gagal terhubung ke backend');
        setLoading(false);
      });
  }, []);

  // Real-time SSE listener for /api/time
  useEffect(() => {
    const eventSource = new EventSource('/api/time');

    eventSource.onopen = () => {
      setSseConnected(true);
      setSseError(null);
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
      console.error('SSE Error:', err);
      setSseConnected(false);
      setSseError('Koneksi stream terputus / reconnecting...');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full text-center space-y-6">
        {/* Header with Gamepad Icon */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            <Icon icon="lucide:gamepad-2" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-400">GamePedia v2</h1>
            <p className="text-slate-400 text-sm mt-1">Real-Time Server Connection & Live Clock Check</p>
          </div>
        </div>

        {/* HTTP Backend Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <Icon icon="lucide:server" className="w-4 h-4 text-indigo-400" />
              <span>HTTP Endpoint Status</span>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center space-x-2 text-yellow-400 font-medium py-1">
              <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
              <p className="text-sm">Memuat pesan dari backend...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-2 text-red-400 font-medium p-2 bg-red-950/40 rounded-lg border border-red-800/40">
              <Icon icon="lucide:alert-circle" className="w-5 h-5 shrink-0" />
              <div className="text-left text-xs">
                <p className="font-semibold">Koneksi HTTP Gagal</p>
                <p className="text-slate-400">{error}</p>
              </div>
            </div>
          )}
          {!loading && !error && (
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full font-medium">
                <Icon icon="lucide:check-circle-2" className="w-3.5 h-3.5" />
                <span>HTTP 200 OK</span>
              </span>
              <span className="text-sm font-semibold text-slate-200">"{message}"</span>
            </div>
          )}
        </div>

        {/* Real-Time Server Time Stream */}
        <div className="p-6 rounded-2xl bg-linear-to-b from-indigo-950/40 to-slate-900 border border-indigo-900/50 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                {sseConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    sseConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                <Icon icon="lucide:radio" className="w-3.5 h-3.5" />
                <span>Real-Time Stream (Per Detik)</span>
              </span>
            </div>
            <span className="flex items-center space-x-1 text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Icon icon="lucide:activity" className="w-3 h-3 text-indigo-400" />
              <span>Ticks: {tickCount}</span>
            </span>
          </div>

          {serverTime ? (
            <div className="space-y-3">
              {/* Digital Clock Display */}
              <div className="bg-slate-950/90 py-4 px-6 rounded-xl border border-indigo-500/20 font-mono shadow-inner space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <Icon icon="lucide:clock" className="w-6 h-6 text-indigo-400 animate-pulse" />
                  <p className="text-4xl font-bold tracking-widest text-indigo-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    {serverTime.timeString}
                  </p>
                </div>
                <p className="text-xs text-slate-400">Waktu Server Real-Time</p>
              </div>

              {/* Timestamp Metadata */}
              <div className="text-left bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <Icon icon="lucide:calendar" className="w-3.5 h-3.5 text-slate-400" />
                    <span>ISO Timestamp:</span>
                  </span>
                  <span className="text-slate-300">{serverTime.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <Icon icon="lucide:timer" className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unix Timestamp:</span>
                  </span>
                  <span className="text-slate-300">{serverTime.unix} ms</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center space-y-2">
              {sseError ? (
                <div className="flex items-center space-x-2 text-amber-400 text-sm font-medium animate-pulse">
                  <Icon icon="lucide:wifi-off" className="w-4 h-4" />
                  <span>{sseError}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-indigo-300 text-sm font-medium animate-pulse">
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Menghubungkan ke Stream Waktu Real-Time...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


