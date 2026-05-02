import { useState } from "react";
import { Msg } from "../types";

export function usePasswordChange() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function changePassword() {
    if (next !== confirm) {
      setMsg({ type: "error", text: "Passwords don't match" });
      return;
    }
    if (next.length < 8) {
      setMsg({ type: "error", text: "Min 8 characters" });
      return;
    }
    setSaving(true);
    setMsg(null);

    const res = await fetch("/api/v1/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMsg({ type: "success", text: "Password changed!" });
      setCurrent("");
      setNext("");
      setConfirm("");
    } else {
      setMsg({ type: "error", text: data.error ?? "Failed" });
    }
    setTimeout(() => setMsg(null), 4000);
  }

  return {
    current,
    setCurrent,
    next,
    setNext,
    confirm,
    setConfirm,
    saving,
    msg,
    changePassword,
  };
}
