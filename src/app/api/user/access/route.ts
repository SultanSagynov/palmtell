import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier, getProfileLimit, getReadingLimit } from "@/lib/access";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let user = await db.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Activate trial for new users on first access (if not already activated)
    if (!user.trialStartedAt && !user.subscription?.id) {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      user = await db.user.update({
        where: { id: user.id },
        data: {
          trialStartedAt: now,
          trialExpiresAt: sevenDaysFromNow,
        },
        include: { subscription: true },
      });
    }

    const tier = getAccessTier(user, user.subscription);
    const profileLimit = getProfileLimit(tier);
    const readingLimit = getReadingLimit(tier);
    
    return NextResponse.json({
      tier,
      accessTier: tier,
      profileLimit,
      readingLimit,
      trialStartedAt: user.trialStartedAt?.toISOString(),
      trialExpiresAt: user.trialExpiresAt?.toISOString(),
      subscription: user.subscription ? {
        status: user.subscription.status,
        plan: user.subscription.plan,
      } : null,
    });
  } catch (error) {
    console.error("Failed to fetch user access:", error);
    return NextResponse.json(
      { error: "Failed to fetch access information" },
      { status: 500 }
    );
  }
}
