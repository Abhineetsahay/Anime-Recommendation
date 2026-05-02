"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";

type DashboardClientProps = {
  user: { id: string; username: string; avatar: string | null; email: string };
  userGenres: { genre: { id: string; name: string } }[];
  recentLists: {
    id: string;
    title: string;
    isPublic: boolean;
    shareToken: string;
    _count: { entries: number };
    entries: {
      anime: { coverImage: string | null; title: string } | null;
    }[];
  }[];
  totalLists: number;
};

const GENRE_COLORS: Record<string, string> = {
  Action: "bg-red-100 text-red-700",
  Adventure: "bg-orange-100 text-orange-700",
  Comedy: "bg-yellow-100 text-yellow-700",
  Drama: "bg-blue-100 text-blue-700",
  Fantasy: "bg-purple-100 text-purple-700",
  Horror: "bg-gray-800 text-gray-100",
  Mystery: "bg-indigo-100 text-indigo-700",
  Romance: "bg-pink-100 text-pink-700",
  "Sci-Fi": "bg-cyan-100 text-cyan-700",
  "Slice of Life": "bg-green-100 text-green-700",
  Sports: "bg-lime-100 text-lime-700",
  Supernatural: "bg-violet-100 text-violet-700",
  Thriller: "bg-rose-100 text-rose-700",
  Mecha: "bg-slate-100 text-slate-700",
  Psychological: "bg-fuchsia-100 text-fuchsia-700",
};

export default function DashboardClient({
  user,
  userGenres,
  recentLists,
  totalLists,
}: DashboardClientProps) {
  const router = useRouter();
  const [creatingList, setCreatingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [createError, setCreateError] = useState("");

  
  async function handleCreateList() {
    if (!newListTitle.trim()) return;
    setLoadingCreate(true);
    setCreateError("");

    try {
      const res = await fetch("/api/v1/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newListTitle, isPublic }),
      });

      const data = await res.json();
      setLoadingCreate(false);

      if (!res.ok) {
        setCreateError(data.error || "Failed to create list");
        return;
      }

      if (res.ok) {
        setCreatingList(false);
        setNewListTitle("");
        router.push(`/list/${data.shareToken}`);
      }
    } catch (error) {
      setLoadingCreate(false);
      setCreateError(
        error instanceof Error ? error.message : "Failed to create list. Please try again."
      );
      console.error("Error creating list:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white font-sans">
      {/* Navbar */}
      <Navbar
        currentPage="dashboard"
        userAvatar={user?.avatar}
        username={user?.username}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">
        {/* Welcome */}
        <section>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hey, <span className="text-purple-400">{user?.username}</span> 👋
          </h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">
            You have {totalLists} list{totalLists !== 1 ? "s" : ""}
          </p>
        </section>

        {/* Genre preferences */}
        <section>
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-widest">
              Your genres
            </h2>
            <Link
              href="/settings/genres"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap"
            >
              Edit →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {userGenres.length === 0 ? (
              <Link href="/onboarding" className="text-sm text-purple-400 hover:underline">
                + Pick your genres
              </Link>
            ) : (
              userGenres.map(({ genre }) => (
                <span
                  key={genre.id}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    GENRE_COLORS[genre.name] ?? "bg-white/10 text-white/70"
                  }`}
                >
                  {genre.name}
                </span>
              ))
            )}
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "Total Lists", value: totalLists },
            {
              label: "Public Lists",
              value: recentLists.filter((l) => l.isPublic).length,
            },
            {
              label: "Total Anime",
              value: recentLists.reduce((acc, l) => acc + l._count.entries, 0),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-5 text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* My Lists */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-widest">
              My Lists
            </h2>
            <button
              onClick={() => setCreatingList(true)}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              + New
            </button>
          </div>

          {/* Create list modal */}
          {creatingList && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
              <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4">
                <h3 className="font-semibold text-lg">Create new list</h3>

                {createError && (
                  <p className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">
                    {createError}
                  </p>
                )}

                <input
                  autoFocus
                  type="text"
                  placeholder="List name..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder:text-white/30"
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setIsPublic(!isPublic)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      isPublic ? "bg-purple-600" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        isPublic ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-white/60">
                    {isPublic
                      ? "Public — anyone can discover"
                      : "Private — only shareable via link"}
                  </span>
                </label>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setCreatingList(false);
                      setNewListTitle("");
                    }}
                    className="flex-1 py-2 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateList}
                    disabled={!newListTitle.trim() || loadingCreate}
                    className="flex-1 py-2 rounded-xl text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-40 transition-colors font-medium"
                  >
                    {loadingCreate ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lists grid */}
          {recentLists.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
              <p className="text-white/30 text-sm">No lists yet.</p>
              <button
                onClick={() => setCreatingList(true)}
                className="mt-3 text-purple-400 text-sm hover:underline"
              >
                Create your first list →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/list/${list.shareToken}`}
                  className="group bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 transition-all hover:bg-white/8 block"
                >
                  {/* Cover previews */}
                  <div className="flex gap-1.5 mb-4 h-14">
                    {list.entries.slice(0, 3).map((entry, i) =>
                      entry.anime?.coverImage ? (
                        <Image
                          key={i}
                          src={entry.anime.coverImage}
                          alt={entry.anime.title}
                          width={40}
                          height={56}
                          className="rounded-lg object-cover h-full w-auto"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          key={i}
                          className="w-10 h-full rounded-lg bg-white/10"
                        />
                      )
                    )}
                    {list.entries.length === 0 && (
                      <div className="w-10 h-full rounded-lg bg-white/5 border border-dashed border-white/10" />
                    )}
                  </div>

                  <p className="font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">
                    {list.title}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-white/30">
                      {list._count.entries} anime
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        list.isPublic
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {list.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
