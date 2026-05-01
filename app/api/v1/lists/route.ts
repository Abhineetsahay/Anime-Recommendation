import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, isPublic } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const list = await prisma.animeList.create({
      data: {
        title: title.trim(),
        isPublic: isPublic ?? false,
        ownerId: currentUser.userId,
      },
    });

    return NextResponse.json({
      id: list.id,
      shareToken: list.shareToken,
    });
  } catch (error) {
    console.error("Create list error:", error);
    return NextResponse.json(
      { error: "Failed to create list. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lists = await prisma.animeList.findMany({
      where: { ownerId: currentUser.userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { entries: true } } },
    });

    return NextResponse.json({ lists });
  } catch (error) {
    console.error("Get lists error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lists. Please try again." },
      { status: 500 }
    );
  }
}