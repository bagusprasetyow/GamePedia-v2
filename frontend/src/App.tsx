import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400">GamePedia v2</h1>
        <p className="text-slate-400 text-sm">Status Koneksi Frontend & Backend</p>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
          {loading && <p className="text-yellow-400 animate-pulse font-medium">Memuat pesan dari backend...</p>}
          {error && (
            <div>
              <p className="text-red-400 font-medium">Koneksi Gagal</p>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div>
              <p className="text-emerald-400 font-medium text-sm mb-1">Status: Terhubung! 🎉</p>
              <p className="text-lg font-semibold text-slate-100">"{message}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
