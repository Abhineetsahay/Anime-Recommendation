import Image from "next/image";
import { STATUS_LABEL, STATUS_STYLES } from "../constants";
import type { Entry } from "../types";

type Props = {
  canEdit: boolean;
  deletingId: string | null;
  entry: Entry;
  index: number;
  listOwnerId: string;
  onDelete: (entryId: string) => void;
  onEdit: (entry: Entry) => void;
};

export default function EntryCard({
  canEdit,
  deletingId,
  entry,
  index,
  listOwnerId,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="group flex gap-4 bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 rounded-2xl p-4 transition-all">
      <div className="w-6 text-center text-sm font-mono text-white/20 pt-1 flex-shrink-0">
        {index + 1}
      </div>

      <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
        {entry.anime.coverImage ? (
          <Image
            src={entry.anime.coverImage}
            alt={entry.anime.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {entry.anime.titleEnglish ?? entry.anime.title}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[entry.status]}`}
              >
                {STATUS_LABEL[entry.status]}
              </span>
              {entry.anime.genres.slice(0, 2).map((genre) => (
                <span key={genre} className="text-xs text-white/30">
                  {genre}
                </span>
              ))}
              {entry.anime.episodes && (
                <span className="text-xs text-white/20">
                  {entry.progress ?? 0}/{entry.anime.episodes} eps
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {entry.rating && (
              <span className="text-sm font-bold text-yellow-400">
                ★ {entry.rating}
              </span>
            )}
            {entry.anime.score && !entry.rating && (
              <span className="text-xs text-white/20">MAL {entry.anime.score}</span>
            )}
            {canEdit && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {entry.notes && (
          <p className="text-xs text-white/30 mt-2 italic line-clamp-1">{entry.notes}</p>
        )}

        {entry.addedBy && entry.addedBy.id !== listOwnerId && (
          <p className="text-xs text-white/20 mt-1">added by {entry.addedBy.username}</p>
        )}
      </div>
    </div>
  );
}
