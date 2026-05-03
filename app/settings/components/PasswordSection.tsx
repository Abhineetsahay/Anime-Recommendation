import { StatusMsg } from "./StatusMsg";
import { Msg } from "../types";

type Props = {
  current: string;
  setCurrent: (v: string) => void;
  next: string;
  setNext: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  msg: Msg;
};

export function PasswordSection({
  current,
  setCurrent,
  next,
  setNext,
  confirm,
  setConfirm,
  onSave,
  saving,
  msg,
}: Props) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-xs text-white/30 mt-0.5">Min 8 characters</p>
      </div>

      <div className="space-y-4">
        {[
          { label: "Current password", value: current, onChange: setCurrent },
          { label: "New password", value: next, onChange: setNext },
          {
            label: "Confirm new password",
            value: confirm,
            onChange: setConfirm,
          },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-xs text-white/40 block mb-1.5">
              {field.label}
            </label>
            <input
              type="password"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSave()}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${
                field.label === "Confirm new password" &&
                confirm &&
                next !== confirm
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/10 focus:border-purple-500"
              }`}
            />
            {field.label === "Confirm new password" &&
              confirm &&
              next !== confirm && (
                <p className="text-xs text-red-400 mt-1">
                  Passwords don&apos;t match
                </p>
              )}
          </div>
        ))}
      </div>

      <StatusMsg msg={msg} />

      <button
        onClick={onSave}
        disabled={saving || !current || !next || !confirm}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-40 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        {saving ? "Changing..." : "Change password"}
      </button>
    </div>
  );
}
