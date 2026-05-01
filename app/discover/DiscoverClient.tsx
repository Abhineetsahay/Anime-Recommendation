"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/app/components/Navbar";
import PageHeader from "./components/PageHeader";
import TabBar from "./components/TabBar";
import SearchBar from "./components/SearchBar";
import AnimeCard from "./components/AnimeCard";
import AnimeGridSkeleton from "./components/AnimeGridSkeleton";
import AnimeModal from "./components/AnimeModal";
import EmptyForYou from "./components/EmptyForYou";
import { Anime, Tab } from "./types";
import { fetchAnimeByTab, fetchUserLists } from "./api";

type Props = {
  userGenres: string[];
  userId: string | null;
  username?: string | null;
  userAvatar?: string | null;
};

export default function DiscoverClient({
  userGenres,
  userId,
  username,
  userAvatar,
}: Props) {
  // State
  const [activeTab, setActiveTab] = useState<Tab>(
    userGenres.length > 0 ? "For You" : "Trending"
  );
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [userLists, setUserLists] = useState<{ id: string; title: string }[]>([]);

  // Fetch anime data
  const fetchAnime = useCallback(
    async (tab: Tab, pageNum = 1, query = "") => {
      setLoading(true);
      try {
        const { data, hasMore } = await fetchAnimeByTab(
          tab,
          pageNum,
          userGenres,
          query
        );
        setAnimeList((prev) => (pageNum === 1 ? data : [...prev, ...data]));
        setHasMore(hasMore);
      } catch (err) {
        console.error("Failed to fetch anime:", err);
      } finally {
        setLoading(false);
      }
    },
    [userGenres]
  );

  // Load user lists
  useEffect(() => {
    if (!userId) return;
    fetchUserLists().then(setUserLists);
  }, [userId]);

  // Fetch when tab changes
  useEffect(() => {
    if (activeTab === "Search") return;
    const timer = window.setTimeout(() => {
      void fetchAnime(activeTab, 1);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeTab, fetchAnime]);

  // Handlers
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
    setAnimeList([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
    setAnimeList([]);
    void fetchAnime("Search", 1, searchInput);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchAnime(activeTab, nextPage, searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Navbar */}
      <Navbar
        currentPage="discover"
        username={username}
        userAvatar={userAvatar}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <PageHeader userGenres={userGenres} />

        {/* Tabs */}
        <TabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userGenresEmpty={userGenres.length === 0}
        />

        {/* Search bar */}
        {activeTab === "Search" && (
          <SearchBar
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearch={handleSearch}
          />
        )}

        {/* Empty state for "For You" */}
        {activeTab === "For You" && userGenres.length === 0 && <EmptyForYou />}

        {/* Anime grid */}
        {animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeList.map((anime,i) => (
              <AnimeCard
                key={i}
                anime={anime}
                onSelectAnime={setSelectedAnime}
                userLists={userLists}
                userId={userId}
              />
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <AnimeGridSkeleton />}

        {/* Load more button */}
        {!loading && hasMore && animeList.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl text-sm transition-colors"
            >
              Load more
            </button>
          </div>
        )}
      </main>

      {/* Anime detail modal */}
      {selectedAnime && (
        <AnimeModal
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
          userLists={userLists}
          userId={userId}
        />
      )}
    </div>
  );
}
