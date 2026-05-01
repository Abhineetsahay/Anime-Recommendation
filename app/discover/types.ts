// types.ts
export type Anime = {
  mal_id: number;
  title: string;
  title_english?: string;
  images: { jpg: { large_image_url: string } };
  score: number;
  genres: { mal_id: number; name: string }[];
  synopsis: string;
  episodes: number;
  status: string;
  year: number;
  type: string;
};

export const TABS = ["For You", "Trending", "Top Rated", "Seasonal", "Search"] as const;
export type Tab = (typeof TABS)[number];

export const JIKAN_GENRE_MAP: Record<string, number> = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  Sports: 30,
  Supernatural: 37,
  Thriller: 41,
  Mecha: 18,
  Psychological: 40,
};
