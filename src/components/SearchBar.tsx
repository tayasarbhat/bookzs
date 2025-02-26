import { Search } from 'lucide-react';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="relative w-80 sm:max-w-xl">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search books..."
        className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base sm:text-sm"
      />
      <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
    </div>
  );
}