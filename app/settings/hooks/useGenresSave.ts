import { useState } from "react";
import { Msg } from "../types";

export function useGenresSave(initial: string[]) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name],
    );
  }

  async function saveGenres() {
    if (selected.length < 3) {
      setMsg({ type: "error", text: "Pick at least 3 genres" });
      return;
    }
    setSaving(true);
    setMsg(null);

    const res = await fetch("/api/v1/user/genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genres: selected }),
    });
    setSaving(false);

    setMsg(
      res.ok
        ? { type: "success", text: "Genres updated!" }
        : { type: "error", text: "Failed to update genres" },
    );
    setTimeout(() => setMsg(null), 3000);
  }

  return { selected, toggle, saving, msg, saveGenres };
}
