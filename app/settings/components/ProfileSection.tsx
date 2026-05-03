import { StatusMsg } from "./StatusMsg";
import { Msg } from "../types";

type Props = {
  email: string;
  username: string;
  bio: string;
  onUsernameChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  msg: Msg;
  onAvatarClick: () => void;
  uploadingAvatar: boolean;
};

export function ProfileSection({
  email,
  username,
  bio,
  onUsernameChange,
  onBioChange,
  onSave,
  saving,
  msg,
  onAvatarClick,
  uploadingAvatar,
}: Props) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-xs text-white/30 mt-0.5">
          Update your public information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/40 block mb-1.5">Email</label>
          <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-2.5 text-sm text-white/40 cursor-not-allowed">
            {email}
          </div>
          <p className="text-xs text-white/20 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="text-xs text-white/40 block mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-white/40 block mb-1.5">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tell others about yourself..."
            maxLength={160}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 resize-none placeholder:text-white/20"
          />
          <p className="text-xs text-white/20 text-right mt-1">
            {bio.length}/160
          </p>
        </div>
      </div>

      <div
        onClick={onAvatarClick}
        className="flex items-center gap-3 border border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-3 sm:p-4 cursor-pointer transition-colors group"
      >
        <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-purple-500/10 flex items-center justify-center transition-colors shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="text-white/30 group-hover:text-purple-400 transition-colors"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
            {uploadingAvatar ? "Uploading..." : "Change profile picture"}
          </p>
          <p className="text-xs text-white/20 mt-0.5">
            JPG, PNG, WebP · Max 5MB 
          </p>
        </div>
      </div>

      <StatusMsg msg={msg} />

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-40 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </div>
  );
}
