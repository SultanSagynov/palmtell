import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDailyHoroscope, getZodiacSign } from "@/lib/horoscope";

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
    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    const sign = getZodiacSign(profile.dob);
    const horoscope = await getDailyHoroscope(sign);

    // Store in database
    const today = new Date().toISOString().split('T')[0];
    await db.horoscope.upsert({
      where: {
        profileId_date: {
          profileId: profile.id,
          date: new Date(today),
        },
      },
      create: {
        profileId: profile.id,
        date: new Date(today),
        sign,
        contentJson: horoscope,
      },
      update: {
        contentJson: horoscope,
      },
    });

    return NextResponse.json({ horoscope });
  } catch (error) {
    console.error("Daily horoscope error:", error);
    return NextResponse.json(
      { error: "Failed to fetch horoscope" },
      { status: 500 }
    );
  }
}
