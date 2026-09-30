import { useState } from "react";
import { SearchInput, ThemeToggle } from "@/components/molecules";

export default function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className="flex items-center justify-end p-6">
        <ThemeToggle display="switch" size="md" />
      </header>

      <main className="flex items-center justify-center px-4 pt-4 pb-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2">
          {/* Search Input Molecule */}
          <SearchInput
            placeholder="Cari game, voucher, atau transaksi..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={(query) => console.log('Mencari:', query)}
          />
        </div>
      </main>
    </div>
  );
}
