import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createLemonSqueezyCheckout } from "@/lib/lemonsqueezy";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { plan, interval } = body as { plan: 'pro' | 'ultimate', interval: 'month' | 'year' };

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    // Handle existing subscription - Lemon Squeezy requires manual cancellation for plan changes
    if (user.subscription?.lsSubscriptionId && user.subscription.status === 'active') {
      // For plan changes, we'll need to cancel the current subscription first
      // This will be handled in the UI with proper messaging
      const planHierarchy = { pro: 1, ultimate: 2 };
      const currentTier = planHierarchy[user.subscription.plan as keyof typeof planHierarchy] || 0;
      const newTier = planHierarchy[plan as keyof typeof planHierarchy] || 0;
      
      if (currentTier !== newTier) {
        // Store pending plan change for UI messaging
        await db.subscription.update({
          where: { userId: user.id },
          data: { pendingPlan: plan },
        });
        
        return NextResponse.json({ 
          error: "Plan change requires canceling current subscription first",
          requiresCancellation: true,
          currentPlan: user.subscription.plan,
          newPlan: plan
        }, { status: 409 });
      }
    }

    const checkoutUrl = await createLemonSqueezyCheckout({
      plan,
      interval,
      userId: user.id,
      userEmail: user.email,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Lemon Squeezy checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
