import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const payload = verifyToken(token);
  if (!payload) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      bio: true,
      createdAt: true,
      genres: { include: { genre: true } },
    },
  });

  if (!user) redirect("/login");

  const allGenres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  return (
    <SettingsClient
      user={JSON.parse(JSON.stringify(user))}
      allGenres={allGenres}
    />
  );
}
