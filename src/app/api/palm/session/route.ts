import { NextRequest, NextResponse } from "next/server";
import { getPalmSession } from "@/lib/session-storage";

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

    return NextResponse.json({
      photoKey: tempData.photo_key,
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
