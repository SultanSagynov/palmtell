import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerPortalUrl } from "@/lib/lemonsqueezy";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });

  if (!user?.subscription?.lsSubscriptionId) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 404 }
    );
  }

  // Lemon Squeezy provides a general customer portal
  const portalUrl = getCustomerPortalUrl();

  return NextResponse.json({ url: portalUrl });
}
