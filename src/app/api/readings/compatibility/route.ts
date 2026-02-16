import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAccessTier } from "@/lib/access";
import { generateCompatibilityReading } from "@/lib/compatibility";
import { PalmAnalysis } from "@/types";

export async function POST(req: Request) {
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

    // Check access tier - compatibility requires Pro+
    const tier = getAccessTier(user, user.subscription);
    if (tier === "expired" || tier === "trial") {
      return NextResponse.json(
        { error: "Compatibility reading requires Pro subscription" },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { profile_id_a, profile_id_b } = body;

    if (!profile_id_a || !profile_id_b) {
      return NextResponse.json(
        { error: "Both profile IDs are required" },
        { status: 400 }
      );
    }

    if (profile_id_a === profile_id_b) {
      return NextResponse.json(
        { error: "Cannot compare a profile with itself" },
        { status: 400 }
      );
    }

    // Verify both profiles belong to user
    const profiles = await db.profile.findMany({
      where: {
        id: { in: [profile_id_a, profile_id_b] },
        userId: user.id,
      },
      include: {
        readings: {
          where: { status: "completed" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (profiles.length !== 2) {
      return NextResponse.json(
        { error: "One or both profiles not found" },
        { status: 404 }
      );
    }

    const [profileA, profileB] = profiles;

    // Check if both profiles have completed readings
    if (!profileA.readings[0] || !profileB.readings[0]) {
      return NextResponse.json(
        { error: "Both profiles need completed palm readings for compatibility analysis" },
        { status: 400 }
      );
    }

    // Generate compatibility reading
    const compatibility = await generateCompatibilityReading(
      {
        profile: profileA,
        analysis: profileA.readings[0].analysisJson as unknown as PalmAnalysis,
      },
      {
        profile: profileB,
        analysis: profileB.readings[0].analysisJson as unknown as PalmAnalysis,
      }
    );

    return NextResponse.json({ compatibility });
  } catch (error) {
    console.error("Compatibility reading error:", error);
    return NextResponse.json(
      { error: "Failed to generate compatibility reading" },
      { status: 500 }
    );
  }
}
