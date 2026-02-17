import OpenAI from "openai";
import { PalmAnalysis } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const VALIDATION_PROMPT = `Look at this image. Does it contain a human palm facing the camera?
Return ONLY one of: {"valid": true} or {"error": "no_palm_detected"}`;

const ANALYSIS_PROMPT = `You are an expert palmist with 30 years of experience.
Carefully analyze the palm lines, mounts, finger shape, and hand structure in the image.
Return ONLY valid JSON with this exact structure — no text outside the JSON:
{
  "personality": { "summary": "string", "traits": ["string"] },
  "life_path": { "summary": "string", "lines": { "life": "string", "head": "string", "heart": "string" } },
  "career": { "summary": "string", "fields": ["string"], "strengths": ["string"] },
  "relationships": { "summary": "string" },
  "health": { "summary": "string" },
  "lucky": { "numbers": [1, 2, 3], "symbol": "string" }
}`;

export async function validatePalmImage(imageUrl: string): Promise<{ valid: boolean; error?: string }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return { valid: false, error: "openai_not_configured" };
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl, detail: "low" } },
            { type: "text", text: VALIDATION_PROMPT }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 100
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Palm validation error:", error);
    return { valid: false, error: "validation_failed" };
  }
}

export async function analyzePalm(imageUrl: string): Promise<PalmAnalysis> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      seed: 42,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
            { type: "text", text: ANALYSIS_PROMPT }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    return analysis as PalmAnalysis;
  } catch (error) {
    console.error("Palm analysis error:", error);
    throw new Error("Analysis failed");
  }
}
