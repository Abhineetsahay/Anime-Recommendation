import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const genresParam = req.nextUrl.searchParams.get("genres");
    let genres: string[] = [];

    if (genresParam) {
      genres = req.nextUrl.searchParams.getAll("genres");
    } else {
      const getUser = await prisma.user.findFirst({
        where: { id: currentUser.userId },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });

      genres = getUser?.genres.map((genre: { genre: { name: string } }) => genre.genre.name) || [];
    }

    if (!genres || genres.length === 0) {
      return NextResponse.json({ data: [], hasMore: false });
    }


    try {
      if (process.env.PYTHON_API_URL) {
        const genreQuery = genres.slice(0, 3).join("&genres=");
        const url = `${process.env.PYTHON_API_URL}/recommend-by-genre?genres=${genreQuery}&top_n=10&min_score=7`;
        
        
        const res = await fetch(url, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          
          return NextResponse.json({ data: data || [], hasMore: false });
        } else {
          console.error("Python API returned:", res.status);
        }
      }
    } catch (err) {
      console.error("Python recommender failed:", err);
    }

    
  } catch (err) {
    console.error("Recommendation error:", err);
    return NextResponse.json(
      { error: "Failed to fetch recommendations", data: [], hasMore: false },
      { status: 500 }
    );
  }
}
