import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });

  if (!user?.subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 404 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
