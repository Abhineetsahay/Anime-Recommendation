import { useState } from "react";
import { Msg } from "../types";

export function useProfileSave() {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function saveProfile(username: string, bio: string) {
    setSaving(true);
    setMsg(null);

    const res = await fetch("/api/v1/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMsg({ type: "success", text: "Profile saved!" });
    } else {
      setMsg({ type: "error", text: data.error ?? "Failed to save" });
    }
    setTimeout(() => setMsg(null), 3000);

    return res.ok;
  }

  return { saving, msg, saveProfile };
}