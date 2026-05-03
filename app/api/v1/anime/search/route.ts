import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    const page = req.nextUrl.searchParams.get("page") || "1";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "AnimeRecommendationApp/1.0",
        },
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to search anime" },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      data: data.data ?? [],
      hasMore: data.pagination?.has_next_page ?? false,
    });
  } catch (error) {
    console.error("Search anime error:", error);
    return NextResponse.json(
      { error: "Failed to search anime" },
      { status: 500 },
    );
  }
}
