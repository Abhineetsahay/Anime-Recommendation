// components/AnimeModal.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anime } from "../types";
import { addAnimeToList } from "../api";

type Props = {
  anime: Anime;
  onClose: () => void;
  userLists: { id: string; title: string }[];
  userId: string | null;
};

export default function AnimeModal({
  anime,
  onClose,
  userLists,
  userId,
}: Props) {
  const [addingTo, setAddingTo] = useState<number | null>(null);

  const handleAddToList = async (listId: string) => {
    setAddingTo(anime.mal_id);
    try {
      await addAnimeToList(listId, anime);
    } catch (err) {
      console.error("Failed to add to list:", err);
    } finally {
      setAddingTo(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a24] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="flex gap-4 p-5">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            width={100}
            height={150}
            className="rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base leading-tight">
              {anime.title_english ?? anime.title}
            </h2>
            {anime.title_english && (
              <p className="text-xs text-white/30 mt-0.5">{anime.title}</p>
            )}
            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {anime.genres.slice(0, 4).map((g) => (
                <span
                  key={g.mal_id}
                  className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full"
                >
                  {g.name}
                </span>
              ))}
            </div>
            {/* Info */}
            <div className="flex gap-3 mt-3 text-xs text-white/40">
              {anime.score && <span>★ {anime.score}</span>}
              {anime.episodes && <span>{anime.episodes} eps</span>}
              {anime.year && <span>{anime.year}</span>}
              <span>{anime.status}</span>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="px-5 pb-3">
          <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
            {anime.synopsis ?? "No synopsis available."}
          </p>
        </div>

        {/* Add to list buttons */}
        {userId && userLists.length > 0 && (
          <div className="px-5 pb-5">
            <p className="text-xs text-white/40 mb-2">Add to list:</p>
            <div className="flex flex-wrap gap-2">
              {userLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleAddToList(list.id)}
                  disabled={addingTo === anime.mal_id}
                  className="text-xs bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                >
                  {addingTo === anime.mal_id ? "Adding..." : list.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Close hint */}
        <div className="text-center px-5 py-3 border-t border-white/5">
          <p className="text-xs text-white/30">Click outside or press ESC to close</p>
        </div>
      </div>
    </div>
  );
}
