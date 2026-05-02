export type Genre = { id: string; name: string };

export type User = {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  genres: { genre: Genre }[];
};

export type Section = "profile" | "genres" | "password";

export type Msg = { type: "success" | "error"; text: string } | null;