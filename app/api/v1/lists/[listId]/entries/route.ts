import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listId } = await params;
  const body = await req.json();
  const { malId, title, titleEnglish, coverImage, genres, type, episodes, score, year } = body;

  // Verify list belongs to the current user
  const list = await prisma.animeList.findUnique({ where: { id: listId } });
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }
  if (list.ownerId !== currentUser.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Upsert anime into local cache
  const anime = await prisma.anime.upsert({
    where: { malId },
    create: { malId, title, titleEnglish, coverImage, genres, type, episodes, score, year },
    update: { coverImage, score },
  });

  // Add to list (skip if already exists)
  try {
    const entry = await prisma.listEntry.create({
      data: {
        listId,
        animeId: anime.id,
        addedById: currentUser.userId,
      },
    });
    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json(
      { error: "Anime already in this list" },
      { status: 409 }
    );
  }
}