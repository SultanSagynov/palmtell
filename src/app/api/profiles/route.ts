import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier, getProfileLimit } from "@/lib/access";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      profiles: {
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { readings: true } } },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ profiles: user.profiles });
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true, profiles: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tier = getAccessTier(user, user.subscription);
  const limit = getProfileLimit(tier);

  if (user.profiles.length >= limit) {
    return NextResponse.json(
      { error: "Profile limit reached. Upgrade your plan." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, dob, avatarEmoji } = body as {
    name: string;
    dob?: string;
    avatarEmoji?: string;
  };

  if (!name || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Profile name is required" },
      { status: 400 }
    );
  }

  const profile = await db.profile.create({
    data: {
      userId: user.id,
      name: name.trim(),
      dob: dob ? new Date(dob) : null,
      avatarEmoji: avatarEmoji || null,
      isDefault: false,
    },
  });

  return NextResponse.json({ profile }, { status: 201 });
}
