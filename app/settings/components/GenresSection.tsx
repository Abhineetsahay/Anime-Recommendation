import { GENRE_COLORS } from "../constants";
import { Genre, Msg } from "../types";
import { StatusMsg } from "./StatusMsg";

type Props = {
  allGenres: Genre[];
  selected: string[];
  onToggle: (name: string) => void;
  onSave: () => void;
  saving: boolean;
  msg: Msg;
};

export function GenresSection({
  allGenres,
  selected,
  onToggle,
  onSave,
  saving,
  msg,
}: Props) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Genre Preferences</h2>
        <p className="text-xs text-white/30 mt-0.5">
          Used to personalise your Discover feed · {selected.length} selected
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {allGenres.map((genre) => {
          const isSelected = selected.includes(genre.name);
          const color = GENRE_COLORS[genre.name] ?? "#8b5cf6";
          return (
            <button
              key={genre.id}
              onClick={() => onToggle(genre.name)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-2 ${
                isSelected
                  ? "border-white/20 bg-white/8 text-white"
                  : "border-white/6 text-white/40 hover:border-white/15 hover:text-white/60"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-all"
                style={{
                  backgroundColor: isSelected ? color : "rgba(255,255,255,0.1)",
                }}
              />
              {genre.name}
            </button>
          );
        })}
      </div>

      <StatusMsg msg={msg} />

      <button
        onClick={onSave}
        disabled={saving || selected.length < 3}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-40 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        {saving ? "Saving..." : "Save genres"}
      </button>
    </div>
  );
}
