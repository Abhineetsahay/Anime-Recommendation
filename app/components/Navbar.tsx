"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type NavbarProps = {
  currentPage: "dashboard" | "discover";
  userAvatar?: string | null;
  username?: string | null;
};

export default function Navbar({
  currentPage,
  userAvatar,
  username,
}: NavbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      setLoggingOut(false);
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  }

  return (
    <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0f0f13]/90 backdrop-blur z-10">
      
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-purple-400">
          AniList
        </span>
        <span className="text-xs text-white/30 font-mono">beta</span>
      </Link>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-all pb-1 px-2 whitespace-nowrap ${
              currentPage === "dashboard"
                ? "text-white border-b-2 border-purple-400"
                : "text-white/50 hover:text-white border-b-2 border-transparent"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/discover"
            className={`text-sm font-medium transition-all pb-1 px-2 whitespace-nowrap ${
              currentPage === "discover"
                ? "text-white border-b-2 border-purple-400"
                : "text-white/50 hover:text-white border-b-2 border-transparent"
            }`}
          >
            Discover
          </Link>
        </div>

        <div className="flex items-center gap-4 ml-auto pl-8 border-l border-white/10">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-white/50 hover:text-white transition-colors whitespace-nowrap"
          >
            {loggingOut ? "..." : "Logout"}
          </button>
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={username || "user"}
              width={32}
              height={32}
              className="rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
              {username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
