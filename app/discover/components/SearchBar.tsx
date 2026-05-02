// components/SearchBar.tsx
"use client";

type Props = {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
};

export default function SearchBar({
  searchInput,
  onSearchInputChange,
  onSearch,
}: Props) {
  return (
    <form onSubmit={onSearch} className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-col sm:flex-row\">
      <input
        autoFocus
        type="text"
        placeholder="Search anime..."
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:border-purple-500 placeholder:text-white/30 transition-all\"
      />
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap\"
      >
        Search
      </button>
    </form>
  );
}
