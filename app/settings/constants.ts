import { Section } from "./types";

export const GENRE_COLORS: Record<string, string> = {
  Action: "#ef4444",
  Adventure: "#f97316",
  Comedy: "#eab308",
  Drama: "#3b82f6",
  Fantasy: "#a855f7",
  Horror: "#6b7280",
  Mystery: "#6366f1",
  Romance: "#ec4899",
  "Sci-Fi": "#06b6d4",
  "Slice of Life": "#22c55e",
  Sports: "#84cc16",
  Supernatural: "#8b5cf6",
  Thriller: "#f43f5e",
  Mecha: "#94a3b8",
  Psychological: "#d946ef",
};

export const NAV_ITEMS: { key: Section; label: string; icon: string }[] = [
  {
    key: "profile",
    label: "Profile",
    icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  },
  {
    key: "genres",
    label: "Genres",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  },
  {
    key: "password",
    label: "Password",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
];
