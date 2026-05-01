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
    "Ecchi",
    "Erotica",
    "Gore",
    "Anthropomorphic",
    "Organized Crime",
    "Otaku Culture",
    "Performing Arts",
    "Parody",
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

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  useEffect(() => {
    const checkFirstLogin = async () => {
      try {
        const respone = await fetch("/api/v1/user/checkFirstLogin");
        const resp = await respone.json();

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
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      console.error("Error saving genres:", error);
    }
  }

  if (isCheckingLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome! 👋</h1>
          <p className="text-gray-600 mt-3 text-base">
            Pick your favourite genres so we can recommend anime you&apos;ll
            love.
          </p>
          <p className="text-sm text-gray-400 mt-2">Choose at least 3</p>
        </div>

        <div className="space-y-6 mb-6">
          {Object.entries(GENRE_CATEGORIES).map(([category, genres]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 pl-1">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {genres.map((genre) => {
                  const isSelected = selected.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all duration-150 truncate
                        ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white shadow-md"
                            : "bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600"
                        }
                      `}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mb-4">
          {selected.length} genre{selected.length !== 1 ? "s" : ""} selected
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 p-3 bg-red-50 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || selected.length < 3}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : "Get started →"}
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
