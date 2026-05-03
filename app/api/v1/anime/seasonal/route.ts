import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const season =
      month < 3
        ? "winter"
        : month < 6
          ? "spring"
          : month < 9
            ? "summer"
            : "fall";

    const res = await fetch(
      `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&limit=20`,
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
        { error: "Failed to fetch seasonal anime" },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      data: data.data ?? [],
      hasMore: data.pagination?.has_next_page ?? false,
    });
  } catch (error) {
    console.error("Seasonal anime error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seasonal anime" },
      { status: 500 },
    );
  }
}
