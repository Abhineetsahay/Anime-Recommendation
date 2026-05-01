import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
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
  } catch (error) {
    console.error("Check first login error:", error);
    return NextResponse.json(
      { error: "Failed to check login status. Please try again." },
      { status: 500 }
    );
  }
}
