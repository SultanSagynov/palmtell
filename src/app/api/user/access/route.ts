import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier } from "@/lib/access";

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
      tier,
      trialExpiresAt: user.trialExpiresAt?.toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch user access:", error);
    return NextResponse.json(
      { error: "Failed to fetch access information" },
      { status: 500 }
    );
  }
}
