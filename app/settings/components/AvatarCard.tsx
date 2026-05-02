import { useRef } from "react";
import Image from "next/image";

type Props = {
  displayAvatar: string | null;
  uploading: boolean;
  username: string;
  email: string;
  joinedDate: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AvatarCard({
  displayAvatar,
  uploading,
  username,
  email,
  joinedDate,
  onFileChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-4 text-center">
      <div className="relative w-20 h-20 mx-auto mb-3">
        {displayAvatar ? (
          <Image
            src={displayAvatar}
            alt="avatar"
            fill
            className={`rounded-full object-cover border-2 border-white/10 ${uploading ? "opacity-50" : ""}`}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold border-2 border-white/10">
            {username[0].toUpperCase()}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0e] transition-colors"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <p className="font-semibold text-sm">{username}</p>
      <p className="text-xs text-white/30 mt-0.5">{email}</p>
      <p className="text-xs text-white/20 mt-1">Joined {joinedDate}</p>
    </div>
  );
}
