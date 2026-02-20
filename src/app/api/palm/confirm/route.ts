import { NextRequest, NextResponse } from "next/server";
import { getPalmSession, confirmPalmSession } from "@/lib/session-storage";
import { validatePalmImage } from "@/lib/palm-validation";
import { getSignedR2Url } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('palm_session')?.value;
    
    if (!sessionToken) {
      console.error("Palm confirmation failed: No session token found");
      return NextResponse.json(
        { error: "No palm session found. Please start over." },
        { status: 400 }
      );
    }

    // Get temp data from Redis
    const tempData = await getPalmSession(sessionToken);
    if (!tempData) {
      console.error(`Palm confirmation failed: Session ${sessionToken} not found in Redis`);
      return NextResponse.json(
        { error: "Session expired. Please start over." },
        { status: 400 }
      );
    }

    // Generate signed URL for secure access
    let imageUrl: string;
    try {
      imageUrl = await getSignedR2Url(tempData.photo_key);
      console.log(`Generated signed URL for palm validation: ${imageUrl.substring(0, 100)}...`);
    } catch (error) {
      console.error("Failed to generate signed URL:", error);
      return NextResponse.json(
        { error: "Failed to access uploaded image" },
        { status: 500 }
      );
    }

    // Run GPT-4o palm validation
    const validation = await validatePalmImage(imageUrl);
    
    if (!validation.is_valid) {
      console.error(`Palm validation failed: ${validation.reason}`);
      return NextResponse.json(
        { error: validation.reason || "Palm validation failed" },
        { status: 400 }
      );
    }

    // Mark session as confirmed
    const confirmed = await confirmPalmSession(sessionToken);
    if (!confirmed) {
      console.error(`Failed to confirm palm session: ${sessionToken}`);
      return NextResponse.json(
        { error: "Failed to confirm palm session" },
        { status: 500 }
      );
    }

    console.log(`Palm confirmed successfully for session: ${sessionToken}`);
    return NextResponse.json({ 
      success: true,
      message: "Palm confirmed successfully" 
    });
  } catch (error) {
    console.error("Palm confirmation error:", error);
    
    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: "Unable to access palm image. Please try again." },
          { status: 500 }
        );
      }
      if (error.message.includes('OpenAI')) {
        return NextResponse.json(
          { error: "Palm validation service temporarily unavailable. Please try again." },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to confirm palm. Please try again." },
      { status: 500 }
    );
  }
}
