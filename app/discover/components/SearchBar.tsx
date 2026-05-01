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
    <form onSubmit={onSearch} className="flex gap-3 mb-6">
      <input
        autoFocus
        type="text"
        placeholder="Search anime..."
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder:text-white/30"
      />
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
}
