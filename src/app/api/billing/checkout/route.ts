import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

const PRICE_MAP: Record<string, string | undefined> = {
  pro_monthly: process.env.STRIPE_PRO_PRICE_ID,
  pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  ultimate_monthly: process.env.STRIPE_ULTIMATE_PRICE_ID,
  ultimate_annual: process.env.STRIPE_ULTIMATE_ANNUAL_PRICE_ID,
};

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { priceKey } = body as { priceKey: string };

  const priceId = PRICE_MAP[priceKey];
  if (!priceId) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: user.email,
    subscription_data: {
      metadata: { user_id: user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
