import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const PALM_VALIDATION_PROMPT = `You are a palm reading expert. Analyze this image and determine if it's suitable for palm reading.

Check for:
1. Is this a human palm (not back of hand)?
2. Is the palm facing the camera?
3. Is the image clear enough to see palm lines?
4. Is this a real hand (not a drawing, not a photo of a screen)?

Return ONLY valid JSON with this exact structure:
{
  "is_valid": true/false,
  "reason": "explanation if invalid"
}

Examples of invalid reasons:
- "No hand visible in image"
- "Back of hand detected, please show palm"
- "Image too blurry to analyze palm lines"
- "Appears to be a photo of screen or drawing"`;

export interface PalmValidationResult {
  is_valid: boolean;
  reason?: string;
}

export async function validatePalmImage(imageUrl: string): Promise<PalmValidationResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return { is_valid: false, reason: "Palm validation service not configured" };
    }

    console.log(`Starting palm validation for image URL: ${imageUrl.substring(0, 100)}...`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl, detail: "low" } },
            { type: "text", text: PALM_VALIDATION_PROMPT }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 150
    });

    if (!response.choices[0]?.message?.content) {
      console.error("OpenAI returned empty response");
      return { is_valid: false, reason: "Palm validation service returned invalid response" };
    }

    const result = JSON.parse(response.choices[0].message.content);
    console.log(`Palm validation result:`, result);
    return result as PalmValidationResult;
  } catch (error: any) {
    console.error("Palm validation error:", error);
    
    // Handle specific OpenAI API errors
    if (error?.status === 400) {
      if (error?.code === 'invalid_image_url') {
        return { is_valid: false, reason: "Unable to access the uploaded image. Please try uploading again." };
      }
      if (error?.error?.message?.includes('image')) {
        return { is_valid: false, reason: "Invalid image format. Please upload a clear photo of your palm." };
      }
    }
    
    if (error?.status === 429) {
      return { is_valid: false, reason: "Palm validation service is busy. Please try again in a moment." };
    }
    
    if (error?.status >= 500) {
      return { is_valid: false, reason: "Palm validation service temporarily unavailable. Please try again." };
    }
    
    // Generic fallback
    return { is_valid: false, reason: "Palm validation failed. Please try again." };
  }
}
