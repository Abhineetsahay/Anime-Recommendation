import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ listId: string; entryId: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listId, entryId } = await params;
  if (!listId || !entryId) {
    return NextResponse.json(
      { error: "Invalid route params" },
      { status: 400 },
    );
  }

  const list = await prisma.animeList.findUnique({ where: { id: listId } });
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }
  if (list.ownerId !== currentUser.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existingEntry = await prisma.listEntry.findFirst({
    where: { id: entryId, listId },
  });
  if (!existingEntry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const { status, rating, progress, notes } = await req.json();

  const entry = await prisma.listEntry.update({
    where: {
      id: entryId,
    },
    data: { status, rating, progress, notes },
  });

  return NextResponse.json(entry);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ listId: string; entryId: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listId, entryId } = await params;
  if (!listId || !entryId) {
    return NextResponse.json(
      { error: "Invalid route params" },
      { status: 400 },
    );
  }

  const list = await prisma.animeList.findUnique({ where: { id: listId } });
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }
  if (list.ownerId !== currentUser.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await prisma.listEntry.deleteMany({
    where: {
      id: entryId,
      listId,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
