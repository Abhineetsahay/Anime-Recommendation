// api.ts
import { Anime, Tab, JIKAN_GENRE_MAP } from "./types";

export async function fetchAnimeByTab(
  tab: Tab,
  pageNum: number,
  userGenres: string[],
  query: string
): Promise<{ data: Anime[]; hasMore: boolean }> {
  try {
    let url = "";

    if (tab === "Trending") {
      url = `https://api.jikan.moe/v4/top/anime?filter=airing&page=${pageNum}&limit=20`;
    } else if (tab === "Top Rated") {
      url = `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${pageNum}&limit=20`;
    } else if (tab === "Seasonal") {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const season =
        month < 3
          ? "winter"
          : month < 6
            ? "spring"
            : month < 9
              ? "summer"
              : "fall";
      url = `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${pageNum}&limit=20`;
    } else if (tab === "Search" && query) {
      url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${pageNum}&limit=20`;
    } else if (tab === "For You" && userGenres.length > 0) {
      const genreQuery = userGenres.slice(0, 3).join("&genres=");
      url = `/api/v1/recommend?genres=${genreQuery}&top_n=20`;
    } else {
      url = `https://api.jikan.moe/v4/top/anime?page=${pageNum}&limit=20`;
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
    
    
    if (url.includes("/api/v1/recommend")) {
      return {
        data: data.data.recommendations ?? [],
        hasMore: data.hasMore ?? false,
      };
    }
    
    return {
      data: data.data ?? [],
      hasMore: data.pagination?.has_next_page ?? false,
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
