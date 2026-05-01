import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import DiscoverClient from "./DiscoverClient";

export default async function DiscoverPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userGenres: string[] = [];
  let userId: string | null = null;
  let username: string | null = null;
  let userAvatar: string | null = null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      userId = payload.userId;
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { username: true, avatar: true },
      });
      username = user?.username || null;
      userAvatar = user?.avatar || null;

      const genres = await prisma.userGenre.findMany({
        where: { userId: payload.userId },
        include: { genre: true },
      });
      userGenres = genres.map((g: { genre: { name: string } }) => g.genre.name);
    }
  }

  return (
    <DiscoverClient
      userGenres={userGenres}
      userId={userId}
      username={username}
      userAvatar={userAvatar}
    />
  );
}
