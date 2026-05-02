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

  const { status, rating, progress, notes } = await req.json();

  const entry = await prisma.listEntry.update({
    where: {
      id: entryId,
      listId,
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

  await prisma.listEntry.delete({
    where: {
      id: entryId,
      listId,
    },
  });

  return NextResponse.json({ success: true });
}
