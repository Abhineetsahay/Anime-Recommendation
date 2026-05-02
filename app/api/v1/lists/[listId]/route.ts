import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { listId: string } },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, isPublic } = await req.json();

  const list = await prisma.animeList.findUnique({
    where: { id: params.listId },
  });
  if (!list || list.ownerId !== currentUser.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.animeList.update({
    where: { id: params.listId },
    data: { title, description, isPublic },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { listId: string } },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.animeList.findUnique({
    where: { id: params.listId },
  });
  if (!list || list.ownerId !== currentUser.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.animeList.delete({ where: { id: params.listId } });
  return NextResponse.json({ success: true });
}
