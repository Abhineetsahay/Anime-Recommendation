import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const findUserDetail = await prisma.user.findFirst({
    where: { id: currentUser.userId },
  });
  return NextResponse.json({
    firstLogin: findUserDetail?.firstLogin,
  });
}
