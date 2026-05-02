import Image from "next/image";
import { STATUS_LABEL, STATUS_OPTIONS, STATUS_STYLES } from "../constants";
import type { Entry, EntryUpdateInput } from "../types";

type Props = {
  editingEntry: Entry;
  onClose: () => void;
  onChange: (entry: Entry) => void;
  onSave: (entryId: string, data: EntryUpdateInput) => void;
};

export default function EditEntryModal({
  editingEntry,
  onClose,
  onChange,
  onSave,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#16161f] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {editingEntry.anime.coverImage && (
            <Image
              src={editingEntry.anime.coverImage}
              alt={editingEntry.anime.title}
              width={40}
              height={56}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-sm">
              {editingEntry.anime.titleEnglish ?? editingEntry.anime.title}
            </h3>
            <p className="text-xs text-white/30 mt-0.5">{editingEntry.anime.year}</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Status</label>
          <div className="grid grid-cols-2 gap-1.5">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => onChange({ ...editingEntry, status })}
                className={`text-xs py-2 rounded-lg border transition-all ${
                  editingEntry.status === status
                    ? STATUS_STYLES[status]
                    : "border-white/8 text-white/30 hover:border-white/20"
                }`}
              >
                {STATUS_LABEL[status]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/40 mb-1.5 block">
            Your rating: {editingEntry.rating ?? "—"}
          </label>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <button
                key={value}
                onClick={() =>
                  onChange({
                    ...editingEntry,
                    rating: editingEntry.rating === value ? null : value,
                  })
                }
                className={`flex-1 py-1.5 rounded text-xs transition-colors ${
                  (editingEntry.rating ?? 0) >= value
                    ? "bg-yellow-500/30 text-yellow-400"
                    : "bg-white/5 text-white/20 hover:bg-white/10"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {editingEntry.anime.episodes && (
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">
              Progress (of {editingEntry.anime.episodes} eps)
            </label>
            <input
              type="number"
              min={0}
              max={editingEntry.anime.episodes}
              value={editingEntry.progress ?? 0}
              onChange={(e) =>
                onChange({
                  ...editingEntry,
                  progress: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Notes</label>
          <textarea
            rows={2}
            placeholder="Your thoughts..."
            value={editingEntry.notes ?? ""}
            onChange={(e) => onChange({ ...editingEntry, notes: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none placeholder:text-white/20"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm text-white/40 border border-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave(editingEntry.id, {
                status: editingEntry.status,
                rating: editingEntry.rating,
                progress: editingEntry.progress,
                notes: editingEntry.notes,
              })
            }
            className="flex-1 py-2 rounded-xl text-sm bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
