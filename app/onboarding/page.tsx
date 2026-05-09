"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GENRE_CATEGORIES = {
  "Action & Adventure": [
    "Action",
    "Adventure",
    "Sci-Fi",
    "Space",
    "Military",
    "Martial Arts",
    "Mecha",
    "Super Power",
    "Survival",
  ],
  "Comedy & Humor": ["Comedy", "Gag Humor", "Parody", "Isekai"],
  "Romance & Relationships": [
    "Romance",
    "Reverse Harem",
    "Harem",
    "Love Status Quo",
  ],
  "Drama & Serious": [
    "Drama",
    "Psychological",
    "Mystery",
    "Detective",
    "Historical",
    "Thriller",
  ],
  "Fantasy & Supernatural": [
    "Fantasy",
    "Supernatural",
    "Vampire",
    "Magic",
    "Avant Garde",
    "Urban Fantasy",
  ],
  "Sports & Games": [
    "Sports",
    "Team Sports",
    "High Stakes Game",
    "Strategy Game",
    "Video Game",
    "Racing",
    "Combat Sports",
  ],
  "Slice of Life": [
    "Slice of Life",
    "Iyashikei",
    "School",
    "Workplace",
    "Educational",
    "Music",
    "Pets",
  ],
  Demographic: ["Shounen", "Shoujo", "Seinen", "Josei", "Kids"],
  "Special & Niche": [
    "Mahou Shoujo",
    "Reincarnation",
    "Time Travel",
    "Villainess",
    "Gore",
    "Anthropomorphic",
    "Organized Crime",
    "Otaku Culture",
    "Performing Arts",
    "Samurai",
    "Showbiz",
    "Crossdressing",
    "Delinquents",
    "Award Winning",
    "Gourmet",
    "Horror",
    "Childcare",
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  "Action & Adventure": "#ef4444",
  "Comedy & Humor": "#f59e0b",
  "Romance & Relationships": "#ec4899",
  "Drama & Serious": "#3b82f6",
  "Fantasy & Supernatural": "#8b5cf6",
  "Sports & Games": "#10b981",
  "Slice of Life": "#06b6d4",
  Demographic: "#6366f1",
  "Special & Niche": "#94a3b8",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  useEffect(() => {
    const checkFirstLogin = async () => {
      try {
        const response = await fetch("/api/v1/user/checkFirstLogin");
        const resp = await response.json();
        if (!resp.firstLogin) {
          router.push("/dashboard");
          return;
        }
        setIsCheckingLogin(false);
      } catch (err) {
        console.error("Error checking first login:", err);
        setIsCheckingLogin(false);
      }
    };
    checkFirstLogin();
  }, [router]);

  function toggleGenre(genre: string) {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }

  async function handleSubmit() {
    if (selected.length < 3) {
      setError("Please pick at least 3 genres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/user/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genres: selected }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error);
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "An error occurred.");
    }
  }

  if (isCheckingLogin) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/40">
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span
            className="text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Checking session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }

        .genre-btn {
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'DM Sans', sans-serif;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .genre-btn:hover {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.06);
        }
        .genre-btn.selected {
          color: white;
          border-color: transparent;
          font-weight: 600;
        }

        .btn-submit {
          background: linear-gradient(135deg, #7C3AED, #6D28D9);
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.01em;
          width: 100%;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(124,58,237,0.4);
        }
        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* Background orbs */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,58,237,0.1), transparent 70%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-[#080810]/90 backdrop-blur border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center">
              <span className="text-xs font-black">A</span>
            </div>
            <span
              className="font-black text-base tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              AniList
            </span>
          </div>

          {/* Progress pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-1.5 w-24 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((selected.length / 3) * 100, 100)}%`,
                    background: selected.length >= 3 ? "#10b981" : "#7C3AED",
                  }}
                />
              </div>
              <span
                className="text-xs text-white/40"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {selected.length}/3 min
              </span>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                selected.length >= 3
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "bg-white/5 text-white/30 border border-white/8"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {selected.length} selected
            </span>
          </div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-40">
        {/* Header */}
        <div className="fade-up text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-purple-400 border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            One-time setup
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            What do you love
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #A78BFA, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              watching?
            </span>
          </h1>
          <p
            className="text-white/40 text-base max-w-sm mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Pick at least 3 genres and we&apos;ll personalise your entire discover
            feed around your taste.
          </p>
        </div>

        {/* Genre categories */}
        <div className="fade-up-1 space-y-8">
          {Object.entries(GENRE_CATEGORIES).map(([category, genres]) => {
            const color = CATEGORY_COLORS[category] ?? "#7C3AED";
            const selectedInCategory = genres.filter((g) =>
              selected.includes(g),
            ).length;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <h2
                    className="text-sm font-bold text-white/60 uppercase tracking-widest"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {category}
                  </h2>
                  {selectedInCategory > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${color}20`, color }}
                    >
                      {selectedInCategory} picked
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {genres.map((genre) => {
                    const isSelected = selected.includes(genre);
                    return (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`genre-btn ${isSelected ? "selected" : ""}`}
                        style={
                          isSelected
                            ? {
                                background: `${color}20`,
                                borderColor: `${color}50`,
                                color: "white",
                                boxShadow: `0 0 12px ${color}15`,
                              }
                            : {}
                        }
                      >
                        {isSelected && (
                          <span className="mr-1.5" style={{ color }}>
                            ✓
                          </span>
                        )}
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#080810]/95 backdrop-blur border-t border-white/5 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="flex items-center gap-2 mb-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p
                className="text-red-400 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-white/30 hover:text-white/60 transition-colors whitespace-nowrap px-4 py-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Skip
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || selected.length < 3}
              className="btn-submit flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Saving preferences...
                </>
              ) : (
                <>
                  {selected.length < 3
                    ? `Pick ${3 - selected.length} more to continue`
                    : `Get started with ${selected.length} genres →`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
