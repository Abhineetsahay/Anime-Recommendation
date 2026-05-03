import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import ListDetailClient from "./ListDetailClient";

export default async function ListPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;

  if (!shareToken) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let currentUserId: string | null = null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) currentUserId = payload.userId;
  }

  const where = currentUserId
    ? {
        shareToken,
        OR: [{ isPublic: true }, { ownerId: currentUserId }],
      }
    : {
        shareToken,
        isPublic: true,
      };

  const list = await prisma.animeList.findFirst({
    where,
    include: {
      owner: { select: { id: true, username: true, avatar: true } },
      entries: {
        orderBy: { order: "asc" },
        include: {
          anime: true,
          addedBy: { select: { id: true, username: true } },
        },
      },
    },
  });

  if (!list) notFound();

  const isOwner = currentUserId === list.ownerId;
  const canEdit = isOwner;

  return (
    <ListDetailClient
      list={JSON.parse(JSON.stringify(list))}
      currentUserId={currentUserId}
      isOwner={isOwner}
      canEdit={canEdit}
    />
  );
}