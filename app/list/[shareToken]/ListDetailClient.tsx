"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATUS_LABEL } from "./constants";
import {
  deleteAnimeList,
  deleteListEntry,
  mergeUpdatedEntry,
  updateAnimeListTitle,
  updateListEntry,
} from "./api";
import type { Entry, EntryUpdateInput, ListDetailClientProps } from "./types";
import StatsGrid from "./components/StatsGrid";
import FilterBar from "./components/FilterBar";
import EntryCard from "./components/EntryCard";
import EditEntryModal from "./components/EditEntryModal";
import ShareModal from "./components/ShareModal";

export default function ListDetailClient({
  list,
  currentUserId,
  isOwner,
  canEdit,
}: ListDetailClientProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(list.entries);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const ratedEntries = entries.filter((entry) => entry.rating);
    const averageScore =
      ratedEntries.length > 0
        ? (
            ratedEntries.reduce((acc, entry) => acc + (entry.rating ?? 0), 0) /
            ratedEntries.length
          ).toFixed(1)
        : "-";

    return {
      total: entries.length,
      completed: entries.filter((entry) => entry.status === "COMPLETED").length,
      watching: entries.filter((entry) => entry.status === "WATCHING").length,
      avgScore: averageScore,
    };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (filterStatus === "ALL") {
      return entries;
    }

    return entries.filter((entry) => entry.status === filterStatus);
  }, [entries, filterStatus]);

  async function copyShareLink() {
    const shareUrl = `${window.location.origin}/list/${list.shareToken}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleUpdateEntry(entryId: string, data: EntryUpdateInput) {
    const ok = await updateListEntry(list.id, entryId, data);
    if (!ok) return;

    setEntries((prev) => mergeUpdatedEntry(prev, entryId, data));
    setEditingEntry(null);
  }

  async function handleDeleteEntry(entryId: string) {
    setDeletingId(entryId);
    const ok = await deleteListEntry(list.id, entryId);

    if (ok) {
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    setDeletingId(null);
  }

  async function handleUpdateListTitle() {
    const ok = await updateAnimeListTitle(list.id, listTitle);
    if (!ok) return;

    setShowEditTitle(false);
    router.refresh();
  }

  async function handleDeleteList() {
    if (!confirm("Delete this list? This cannot be undone.")) return;

    const ok = await deleteAnimeList(list.id);
    if (ok) {
      router.push("/dashboard");
    }
  }

  const bannerImage = entries[0]?.anime.coverImage ?? null;

  return (
    <div
      className="min-h-screen bg-[#0c0c10] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');`}</style>

      <nav className="border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0c0c10]/95 backdrop-blur z-20">
        <Link
          href="/dashboard"
          className="text-purple-400 font-bold tracking-tight text-lg"
        >
          AniList
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 text-xs bg-white/8 hover:bg-white/12 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            Share
          </button>
          {isOwner && (
            <button
              onClick={handleDeleteList}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              Delete list
            </button>
          )}
        </div>
      </nav>

      <div className="relative h-52 overflow-hidden">
        {bannerImage && (
          <>
            <Image
              src={bannerImage}
              alt=""
              fill
              className="object-cover scale-110 blur-2xl opacity-20"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0c0c10]" />
          </>
        )}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6">
          <div className="flex items-end justify-between">
            <div>
              {showEditTitle && isOwner ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && void handleUpdateListTitle()
                    }
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-2xl font-bold focus:outline-none focus:border-purple-500"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  />
                  <button
                    onClick={() => void handleUpdateListTitle()}
                    className="text-xs bg-purple-600 px-3 py-1.5 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowEditTitle(false)}
                    className="text-xs text-white/40"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {listTitle}
                  </h1>
                  {isOwner && (
                    <button
                      onClick={() => setShowEditTitle(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                <span>by {list.owner.username}</span>
                <span>·</span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-xs ${
                    list.isPublic
                      ? "border-green-500/20 text-green-400 bg-green-500/10"
                      : "border-white/10 text-white/30"
                  }`}
                >
                  {list.isPublic ? "Public" : "Private"}
                </span>
                {currentUserId === list.ownerId && (
                  <span className="text-white/25">Owner view</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pb-16 mt-2">
        <StatsGrid stats={stats} />

        <FilterBar
          canEdit={canEdit}
          entries={entries}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {filteredEntries.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/8 rounded-2xl">
            <p className="text-white/20 text-sm">
              {filterStatus === "ALL"
                ? "No anime in this list yet."
                : `No anime with status "${STATUS_LABEL[filterStatus]}".`}
            </p>
            {canEdit && filterStatus === "ALL" && (
              <Link
                href="/discover"
                className="text-purple-400 text-sm hover:underline mt-2 inline-block"
              >
                Browse and add from Discover &rarr;
              </Link>
            )}
          </div>
        )}

        <div className="space-y-3">
          {filteredEntries.map((entry, index) => (
            <EntryCard
              key={entry.id}
              canEdit={canEdit}
              deletingId={deletingId}
              entry={entry}
              index={index}
              listOwnerId={list.ownerId}
              onDelete={handleDeleteEntry}
              onEdit={setEditingEntry}
            />
          ))}
        </div>
      </main>

      {editingEntry && (
        <EditEntryModal
          editingEntry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onChange={setEditingEntry}
          onSave={handleUpdateEntry}
        />
      )}

      {showShareModal && (
        <ShareModal
          copied={copied}
          listShareToken={list.shareToken}
          onClose={() => setShowShareModal(false)}
          onCopy={() => void copyShareLink()}
        />
      )}
    </div>
  );
}
