// api.ts
import { Anime, Tab } from "./types";

export async function fetchAnimeByTab(
  tab: Tab,
  pageNum: number,
  userGenres: string[],
  query: string
): Promise<{ data: Anime[]; hasMore: boolean }> {
  try {
    let url = "";

    if (tab === "Trending") {
      url = `/api/v1/anime/trending?page=${pageNum}`;
    } else if (tab === "Top Rated") {
      url = `/api/v1/anime/top-rated?page=${pageNum}`;
    } else if (tab === "Seasonal") {
      url = `/api/v1/anime/seasonal?page=${pageNum}`;
    } else if (tab === "Search" && query) {
      url = `/api/v1/anime/search?q=${encodeURIComponent(query)}&page=${pageNum}`;
    } else if (tab === "For You" && userGenres.length > 0) {
      const genreQuery = userGenres.slice(0, 3).join("&genres=");
      url = `/api/v1/recommend?genres=${genreQuery}&top_n=20`;
    } else {
      url = `/api/v1/anime/top-rated?page=${pageNum}`;
    }

    if (!url) {
      return { data: [], hasMore: false };
    }

    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`Fetch failed: ${res.status}`);
      return { data: [], hasMore: false };
    }

    const data = await res.json();
    
    return {
      data: data.data ?? [],
      hasMore: data.hasMore ?? false,
    };
  } catch (err) {
    console.error("Failed to fetch anime:", err);
    return { data: [], hasMore: false };
  }
}

export async function fetchUserLists(): Promise<{ id: string; title: string }[]> {
  try {
    const res = await fetch("/api/v1/lists");
    if (!res.ok) {
      throw new Error(`Lists fetch failed: ${res.status}`);
    }
    const data = await res.json();
    return data.lists ?? [];
  } catch (err) {
    console.error("Failed to fetch lists:", err);
    return [];
  }
}

export async function addAnimeToList(listId: string, anime: Anime): Promise<void> {
  try {
    const res = await fetch(`/api/v1/lists/${listId}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        malId: anime.mal_id,
        title: anime.title,
        titleEnglish: anime.title_english,
        coverImage: anime.images.jpg.large_image_url,
        genres: anime.genres.map((g) => g.name),
        type: anime.type,
        episodes: anime.episodes,
        score: anime.score,
        year: anime.year,
      }),
    });

    if (!res.ok) {
      throw new Error(`Add to list failed: ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to add anime to list:", err);
    throw err;
  }
}
