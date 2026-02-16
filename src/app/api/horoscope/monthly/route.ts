import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier } from "@/lib/access";
import { getMonthlyHoroscope } from "@/lib/horoscope";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profileId = req.nextUrl.searchParams.get("profile_id");
  if (!profileId) {
    return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check access tier - monthly horoscope requires Pro+
    const tier = getAccessTier(user, user.subscription);
    if (tier === "expired" || tier === "trial") {
      return NextResponse.json(
        { error: "Monthly horoscope requires Pro subscription" },
        { status: 402 }
      );
    }

    const profile = await db.profile.findFirst({
      where: { id: profileId, userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (!profile.dob) {
      return NextResponse.json(
        { error: "Date of birth required for horoscope" },
        { status: 400 }
      );
    }

    const horoscope = await getMonthlyHoroscope(profile.id, profile.dob);

    return NextResponse.json({ horoscope });
  } catch (error) {
    console.error("Monthly horoscope error:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly horoscope" },
      { status: 500 }
    );
  }
}
