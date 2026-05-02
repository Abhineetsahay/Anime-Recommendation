import { Msg } from "../types";

export function StatusMsg({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p className={`text-sm px-4 py-2.5 rounded-xl border ${
      msg.type === "success"
        ? "bg-green-500/10 text-green-400 border-green-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20"
    }`}>
      {msg.text}
    </p>
  );
}