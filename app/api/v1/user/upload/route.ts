import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToAzure, deleteFromAzure } from "@/lib/azure";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "JPG, PNG or WebP only" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
  }

  // Delete old avatar from Azure
  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: { avatar: true },
  });
  if (user?.avatar?.includes("blob.core.windows.net")) {
    await deleteFromAzure(user.avatar).catch(() => {});
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToAzure(buffer, file.name, file.type);

  await prisma.user.update({
    where: { id: currentUser.userId },
    data: { avatar: url },
  });

  return NextResponse.json({ url });
}
