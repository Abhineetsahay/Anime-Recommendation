// components/AnimeCard.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anime } from "../types";
import { addAnimeToList } from "../api";

type Props = {
  anime: Anime;
  onSelectAnime: (anime: Anime) => void;
  userLists: { id: string; title: string }[];
  userId: string | null;
};

export default function AnimeCard({
  anime,
  onSelectAnime,
  userLists,
  userId,
}: Props) {
  const [showListPicker, setShowListPicker] = useState(false);
  const [addingTo, setAddingTo] = useState<number | null>(null);

  const handleAddToList = async (listId: string) => {
    setAddingTo(anime.mal_id);
    try {
      await addAnimeToList(listId, anime);
      setShowListPicker(false);
    } catch (err) {
      console.error("Failed to add to list:", err);
    } finally {
      setAddingTo(null);
    }
  };

  return (
    <div className="group relative">
      <div className="cursor-pointer" onClick={() => onSelectAnime(anime)}>
        {/* Cover */}
        <div className="relative w-full rounded-xl overflow-hidden bg-white/5 mb-2 flex items-center justify-center min-h-[240px]">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            width={160}
            height={240}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
            unoptimized
          />
          {/* Score badge */}
          {anime.score && (
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded-lg text-xs font-bold text-yellow-400">
              ★ {anime.score}
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-purple-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs font-medium">View details</span>
          </div>
        </div>
        <p className="text-xs font-medium truncate text-white/80 group-hover:text-white transition-colors">
          {anime.title_english ?? anime.title}
        </p>
        <p className="text-xs text-white/30 mt-0.5">
          {anime.year ?? "—"} · {anime.type}
        </p>
      </div>

      {/* Add to list button */}
      {userId && (
        <div className="relative mt-1.5">
          <button
            onClick={() => setShowListPicker(!showListPicker)}
            className="w-full text-xs text-white/40 hover:text-purple-400 border border-white/10 hover:border-purple-500/50 rounded-lg py-1 transition-all"
          >
            + Add to list
          </button>

          {/* List picker dropdown */}
          {showListPicker && (
            <div className="absolute bottom-full mb-1 left-0 right-0 bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
              {userLists.length === 0 ? (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-xs text-purple-400 hover:bg-white/5"
                >
                  Create a list first →
                </Link>
              ) : (
                userLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => handleAddToList(list.id)}
                    disabled={addingTo === anime.mal_id}
                    className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                  >
                    {addingTo === anime.mal_id ? "Adding..." : list.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
