import type { Entry, EntryUpdateInput } from "./types";

export async function updateListEntry(
  listId: string,
  entryId: string,
  data: EntryUpdateInput,
): Promise<boolean> {
  const res = await fetch(`/api/v1/lists/${listId}/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.ok;
}

export async function deleteListEntry(
  listId: string,
  entryId: string,
): Promise<boolean> {
  const res = await fetch(`/api/v1/lists/${listId}/entries/${entryId}`, {
    method: "DELETE",
  });

  return res.ok;
}

export async function updateAnimeListTitle(
  listId: string,
  title: string,
): Promise<boolean> {
  const res = await fetch(`/api/v1/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  return res.ok;
}

export async function updateAnimeListVisibility(
  listId: string,
  isPublic: boolean,
): Promise<boolean> {
  const res = await fetch(`/api/v1/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublic }),
  });

  return res.ok;
}

export async function deleteAnimeList(listId: string): Promise<boolean> {
  const res = await fetch(`/api/v1/lists/${listId}`, { method: "DELETE" });
  return res.ok;
}

export function mergeUpdatedEntry(entries: Entry[], entryId: string, data: EntryUpdateInput): Entry[] {
  return entries.map((entry) => (entry.id === entryId ? { ...entry, ...data } : entry));
}
