import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { genres } = await req.json();

  if (!genres || genres.length < 3) {
    return NextResponse.json(
      { error: "Pick at least 3 genres" },
      { status: 400 }
    );
  }

  // Fetch genre IDs from DB by name
  const genreRecords = await prisma.genre.findMany({
    where: { name: { in: genres } },
  });

  console.log(genreRecords);
  
  if (genreRecords.length === 0) {
    return NextResponse.json(
      { error: "Invalid genres provided" },
      { status: 400 }
    );
  }

  // Delete old preferences first (in case user updates later)
  await prisma.userGenre.deleteMany({
    where: { userId: currentUser.userId },
  });

  // Insert new preferences
  await prisma.userGenre.createMany({
    data: genreRecords.map(genre => ({
      userId: currentUser.userId,
      genreId: genre.id,
    })),
  });

  // Mark firstLogin as false
  await prisma.user.update({
    where: { id: currentUser.userId },
    data: { firstLogin: false },
  });

  return NextResponse.json({ success: true });
}

// GET — fetch current user's genres (for updating preferences later)
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userGenres = await prisma.userGenre.findMany({
    where: { userId: currentUser.userId },
    include: { genre: true },
  });

  return NextResponse.json({
    genres: userGenres.map(ug => ug.genre.name),
  });
}