import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: { type: string; data: Record<string, unknown> };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as { type: string; data: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data as {
      id: string;
      email_addresses: { email_address: string }[];
      first_name: string | null;
      last_name: string | null;
    };

    const email = email_addresses[0]?.email_address;
    if (!email) {
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    // Create user and default profile
    await db.user.create({
      data: {
        clerkId: id,
        email,
        name,
        profiles: {
          create: {
            name: "Me",
            isDefault: true,
          },
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}
