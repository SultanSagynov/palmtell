import { NextRequest, NextResponse } from "next/server";
import { getPalmSession } from "@/lib/session-storage";
import { getSignedR2Url } from "@/lib/r2";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('palm_session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: "No palm session found" },
        { status: 400 }
      );
    }

    // Get temp data from Redis
    const tempData = await getPalmSession(sessionToken);
    if (!tempData) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 400 }
      );
    }

    // Generate signed URL for image preview
    let photoUrl: string | null = null;
    try {
      photoUrl = await getSignedR2Url(tempData.photo_key);
    } catch (error) {
      console.error("Failed to generate signed URL for preview:", error);
      // Continue without photo URL - the UI will handle the fallback
    }

    return NextResponse.json({
      photoKey: tempData.photo_key,
      photoUrl,
      dob: tempData.dob,
      confirmed: tempData.confirmed
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session data" },
      { status: 500 }
    );
  }
}
