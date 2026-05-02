import { useState } from "react";
import { Msg } from "../types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function useAvatarUpload(initialAvatar: string | null) {
  const [avatar, setAvatar] = useState(initialAvatar);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMsg({ type: "error", text: "Only JPG, PNG or WebP allowed" });
      setTimeout(() => setMsg(null), 3000);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setMsg({
        type: "error",
        text: `File too large — max 5MB (yours: ${(file.size / 1024 / 1024).toFixed(1)}MB)`,
      });
      setTimeout(() => setMsg(null), 3000);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/v1/user/upload", {
      method: "POST",
      body: formData,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    setUploading(false);
    setAvatarPreview(null);
    e.target.value = "";

    if (res.ok) {
      setAvatar(data.url);
      setMsg({ type: "success", text: "Avatar updated!" });
    } else {
      setMsg({ type: "error", text: data.error ?? "Upload failed" });
    }
    setTimeout(() => setMsg(null), 3000);
  }

  return {
    avatar,
    avatarPreview,
    uploading,
    msg,
    handleFileChange,
    displayAvatar: avatarPreview ?? avatar,
  };
}
