import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 413 });
    }

    // Generate temporary token
    const tempToken = nanoid(32);
    
    // Convert File to Buffer for R2 upload
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to R2 with temp prefix
    const imageKey = `temp/${tempToken}/${Date.now()}.jpg`;
    const imageUrl = await uploadToR2(buffer, imageKey, image.type);

    // Store temp reading data in a simple in-memory store or database
    // For now, we'll encode the data in the token itself (not recommended for production)
    const tempData = {
      imageUrl,
      imageKey,
      createdAt: new Date().toISOString(),
    };

    // In production, you'd store this in Redis or database with TTL
    // For now, we'll return the token with encoded data
    const encodedToken = Buffer.from(JSON.stringify(tempData)).toString('base64url');

    return NextResponse.json({ 
      tempReadingToken: encodedToken,
      message: "Image uploaded successfully" 
    });

  } catch (error) {
    console.error("Temp reading upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
