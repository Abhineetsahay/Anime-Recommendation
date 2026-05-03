"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Genre, User, Section } from "./types";
import { AvatarCard } from "./components/AvatarCard";
import { SettingsNav } from "./components/SettingsNav";
import { ProfileSection } from "./components/ProfileSection";
import { GenresSection } from "./components/GenresSection";
import { PasswordSection } from "./components/PasswordSection";
import { useAvatarUpload } from "./hooks/useAvatarUpload";
import { useProfileSave } from "./hooks/useProfileSave";
import { useGenresSave } from "./hooks/useGenresSave";
import { usePasswordChange } from "./hooks/usePasswordChange";

type Props = { user: User; allGenres: Genre[] };

export default function SettingsClient({ user, allGenres }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");

  const avatar = useAvatarUpload(user.avatar);
  const profile = useProfileSave();
  const genres = useGenresSave(user.genres.map((g) => g.genre.name));
  const password = usePasswordChange();

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function handleProfileSave() {
    const ok = await profile.saveProfile(username, bio);
    if (ok) router.refresh();
  }

  return (
    <div
      className="min-h-screen bg-[#0a0a0e] text-white"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <nav className="relative border-b border-white/6 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="text-purple-400 font-bold tracking-tight text-lg"
        >
          AniList
        </Link>
        <Link
          href="/dashboard"
          className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to dashboard
        </Link>
      </nav>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <AvatarCard
            displayAvatar={avatar.displayAvatar}
            uploading={avatar.uploading}
            username={username}
            email={user.email}
            joinedDate={joinedDate}
            onFileChange={avatar.handleFileChange}
          />
          <SettingsNav active={activeSection} onChange={setActiveSection} />
        </aside>

        <main className="flex-1 min-w-0 w-full">
          {activeSection === "profile" && (
            <ProfileSection
              email={user.email}
              username={username}
              bio={bio}
              onUsernameChange={setUsername}
              onBioChange={setBio}
              onSave={handleProfileSave}
              saving={profile.saving}
              msg={profile.msg ?? avatar.msg}
              onAvatarClick={() => fileInputRef.current?.click()}
              uploadingAvatar={avatar.uploading}
            />
          )}
          {activeSection === "genres" && (
            <GenresSection
              allGenres={allGenres}
              selected={genres.selected}
              onToggle={genres.toggle}
              onSave={genres.saveGenres}
              saving={genres.saving}
              msg={genres.msg}
            />
          )}
          {activeSection === "password" && (
            <PasswordSection
              current={password.current}
              setCurrent={password.setCurrent}
              next={password.next}
              setNext={password.setNext}
              confirm={password.confirm}
              setConfirm={password.setConfirm}
              onSave={password.changePassword}
              saving={password.saving}
              msg={password.msg}
            />
          )}
        </main>
      </div>
    </div>
  );
}
