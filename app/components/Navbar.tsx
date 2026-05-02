"use client";

import { useEffect, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileNavDetailOpen, setmobileNavDetailOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setLoggingOut(false);

      alert("Failed to logout. Please try again.");
    }
  }

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const avatarButton = document.querySelector("[data-avatar-button]");
      const avatarMenu = document.querySelector("[data-avatar-menu]");

      if (!avatarButton?.contains(target) && !avatarMenu?.contains(target)) {
        setAvatarMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f13]/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-purple-400 sm:text-2xl">
              AniList
            </span>

            <span className="hidden font-mono text-xs text-white/30 sm:inline">
              beta
            </span>
          </Link>

          <div className="flex items-center gap-12">
            <div className="hidden sm:flex items-center gap-8">
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
            <div className="flex items-center gap-4 ml-auto pl-8 border-l border-white/10 sm:border-0 sm:pl-0">
              <div
                data-avatar-button
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setAvatarMenuOpen(!avatarMenuOpen);
                }}
              >
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={username || "user"}
                    width={80}
                    height={80}
                    className="h-16 w-16 rounded-full border-2 border-purple-400/40 object-cover cursor-pointer hover:border-purple-400/60 transition-all"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-16 w-16 p-3 items-center justify-center rounded-full bg-purple-600 text-base font-bold text-white cursor-pointer hover:bg-purple-700 transition-all">
                    {username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <button
                onClick={() => setmobileNavDetailOpen(!mobileNavDetailOpen)}
                className="sm:hidden ml-4 p-2 rounded-lg transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className={`h-6 w-6 text-white transition-transform duration-200 ${
                    mobileNavDetailOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileNavDetailOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {avatarMenuOpen && (
        <div
          data-avatar-menu
          className="fixed top-28 right-8 w-48 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all rounded-t-lg"
          >
            Settings
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
              setAvatarMenuOpen(false);
            }}
            disabled={loggingOut}
            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all rounded-b-lg border-t border-white/5 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && mobileNavDetailOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#0f0f13]/95 backdrop-blur px-4 py-3">
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setmobileNavDetailOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                currentPage === "dashboard"
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/discover"
              onClick={() => setmobileNavDetailOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                currentPage === "discover"
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              Discover
            </Link>

            <button
              onClick={async () => {
                await handleLogout();
                setmobileNavDetailOpen(false);
              }}
              disabled={loggingOut}
              className="mt-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all border-t border-white/5 disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
