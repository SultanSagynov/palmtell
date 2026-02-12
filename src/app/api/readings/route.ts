import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier, getReadingLimit } from "@/lib/access";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const profileId = req.nextUrl.searchParams.get("profile_id");

  const readings = await db.reading.findMany({
    where: {
      userId: user.id,
      ...(profileId ? { profileId } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { profile: { select: { name: true, avatarEmoji: true } } },
  });

  return NextResponse.json({ readings });
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tier = getAccessTier(user, user.subscription);

  // Check quota
  if (tier === "expired") {
    return NextResponse.json(
      { error: "Trial expired. Please upgrade." },
      { status: 402 }
    );
  }

  const limit = getReadingLimit(tier);
  if (limit !== Infinity) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const count = await db.reading.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfMonth },
      },
    });

    if (count >= limit) {
      return NextResponse.json(
        { error: "Reading quota reached for this period." },
        { status: 429 }
      );
    }
  }

  const body = await req.json();
  const { profileId } = body as { profileId: string };

  if (!profileId) {
    return NextResponse.json(
      { error: "Profile ID is required" },
      { status: 400 }
    );
  }

  // Verify profile belongs to user
  const profile = await db.profile.findFirst({
    where: { id: profileId, userId: user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Start trial if first reading
  if (!user.trialStartedAt) {
    await db.user.update({
      where: { id: user.id },
      data: {
        trialStartedAt: new Date(),
        trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create reading in pending state
  const reading = await db.reading.create({
    data: {
      userId: user.id,
      profileId,
      status: "pending",
    },
  });

  // TODO: Enqueue AI analysis job (QStash/BullMQ)
  // For now, mark as pending — the analysis pipeline will be implemented in a later session

  return NextResponse.json({ reading }, { status: 201 });
}
