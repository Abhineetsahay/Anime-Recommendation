import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username, bio } = await req.json();

  // Check username not taken by someone else
  if (username) {
    const existing = await prisma.user.findFirst({
      where: { username, NOT: { id: currentUser.userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: currentUser.userId },
    data: {
      ...(username && { username }),
      ...(bio !== undefined && { bio }),
    },
    select: { id: true, email: true, username: true, avatar: true, bio: true },
  });

  return NextResponse.json({ user });
}
