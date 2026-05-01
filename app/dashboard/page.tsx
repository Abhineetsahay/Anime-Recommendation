import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import DashboardClient from "./dashboard-client";

async function getDashboardData() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
  });

  if (!user) {
    redirect("/login");
  }

  const userGenres = await prisma.userGenre.findMany({
    where: { userId: user.id },
    include: { genre: true },
  });

  const recentLists = await prisma.animeList.findMany({
    where: { ownerId: user.id },
    take: 6,
    include: {
      _count: { select: { entries: true } },
      entries: {
        take: 3,
        include: { anime: { select: { coverImage: true, title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalLists = await prisma.animeList.count({
    where: { ownerId: user.id },
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
    },
    userGenres,
    recentLists,
    totalLists,
  };
}

export default async function Page() {
  const data = await getDashboardData();

  return <DashboardClient {...data} />;
}
