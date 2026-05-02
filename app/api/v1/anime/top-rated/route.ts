import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";

    const res = await fetch(
      `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}&limit=20`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch top anime" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      data: data.data ?? [],
      hasMore: data.pagination?.has_next_page ?? false,
    });
  } catch (error) {
    console.error("Top anime error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top anime" },
      { status: 500 }
    );
  }
}
