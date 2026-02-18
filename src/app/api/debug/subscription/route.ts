import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier, getProfileLimit, getReadingLimit } from "@/lib/access";

/**
 * DEBUG endpoint for subscription status
 * Shows detailed subscription information
 */
export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tier = getAccessTier(user, user.subscription);
    
    return NextResponse.json({
      userId: user.id,
      clerkId: user.clerkId,
      email: user.email,
      createdAt: user.createdAt,
      tier,
      profileLimit: getProfileLimit(tier),
      readingLimit: getReadingLimit(tier),
      trialStartedAt: user.trialStartedAt,
      trialExpiresAt: user.trialExpiresAt,
      subscription: user.subscription ? {
        id: user.subscription.id,
        plan: user.subscription.plan,
        status: user.subscription.status,
        lsSubscriptionId: user.subscription.lsSubscriptionId,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        cancelsAt: user.subscription.cancelsAt,
      } : null,
    });
  } catch (error) {
    console.error("Failed to fetch debug info:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug information" },
      { status: 500 }
    );
  }
}
