import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const metadata = subscription.metadata;
      const userId = metadata?.user_id;

      if (!userId) break;

      const plan = subscription.items.data[0]?.price.lookup_key || "pro";
      const status =
        subscription.status === "active" ? "active" : subscription.status;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = (subscription as any).current_period_end as
        | number
        | undefined;

      await db.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId,
          stripeSubscriptionId: subscription.id,
          plan,
          status,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        },
        update: {
          stripeSubscriptionId: subscription.id,
          plan,
          status,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;

      if (userId) {
        await db.subscription.update({
          where: { userId },
          data: { status: "canceled" },
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawSubscription = (invoice as any).subscription;
      const subscriptionId =
        typeof rawSubscription === "string" ? rawSubscription : null;

      if (subscriptionId) {
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "past_due" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
