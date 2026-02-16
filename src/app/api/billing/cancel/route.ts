import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cancelLemonSqueezySubscription } from "@/lib/lemonsqueezy";
import { sendEmail, createSubscriptionCanceledEmail } from "@/lib/email";

export async function POST() {
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

  try {
    // Cancel subscription in Lemon Squeezy
    await cancelLemonSqueezySubscription(user.subscription.lsSubscriptionId);

    // Update subscription status in database
    await db.subscription.update({
      where: { userId: user.id },
      data: { 
        status: 'canceled',
        // Keep access until current period end
        cancelsAt: user.subscription.currentPeriodEnd,
      },
    });

    // Send cancellation email
    try {
      const endDate = user.subscription.currentPeriodEnd?.toLocaleDateString() || 'end of current period';
      const cancelEmail = createSubscriptionCanceledEmail(
        user.email, 
        user.name || "there", 
        endDate
      );
      await sendEmail(cancelEmail);
    } catch (error) {
      console.error("Failed to send cancellation email:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
