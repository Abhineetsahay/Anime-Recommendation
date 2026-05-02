export type Anime = {
  id: string;
  malId: number;
  title: string;
  titleEnglish: string | null;
  coverImage: string | null;
  genres: string[];
  type: string | null;
  episodes: number | null;
  score: number | null;
  year: number | null;
  synopsis: string | null;
};

export type Entry = {
  id: string;
  status: string;
  rating: number | null;
  progress: number | null;
  notes: string | null;
  order: number;
  anime: Anime;
  addedBy: { id: string; username: string } | null;
};

export type AnimeListDetail = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  shareToken: string;
  editToken: string;
  ownerId: string;
  createdAt: string;
  owner: { id: string; username: string; avatar: string | null };
  entries: Entry[];
};

export type ListDetailClientProps = {
  list: AnimeListDetail;
  currentUserId: string | null;
  isOwner: boolean;
  canEdit: boolean;
};

export type ListStats = {
  total: number;
  completed: number;
  watching: number;
  avgScore: string;
};

export type EntryUpdateInput = {
  status: string;
  rating: number | null;
  progress: number | null;
  notes: string | null;
};
