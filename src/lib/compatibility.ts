import OpenAI from "openai";
import { PalmAnalysis } from "@/types";
import { getZodiacSign } from "./horoscope";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

interface ProfileData {
  profile: {
    id: string;
    name: string;
    dob: Date | null;
    avatarEmoji?: string | null;
  };
  analysis: PalmAnalysis;
}

export interface CompatibilityReading {
  profileA: {
    name: string;
    emoji?: string;
  };
  profileB: {
    name: string;
    emoji?: string;
  };
  overallScore: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  categories: {
    communication: { score: number; description: string };
    emotional: { score: number; description: string };
    lifestyle: { score: number; description: string };
    goals: { score: number; description: string };
  };
  zodiacCompatibility?: {
    signA: string;
    signB: string;
    description: string;
  };
}

export async function generateCompatibilityReading(
  profileA: ProfileData,
  profileB: ProfileData
): Promise<CompatibilityReading> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    // Get zodiac signs if DOB available
    const signA = profileA.profile.dob ? getZodiacSign(profileA.profile.dob) : null;
    const signB = profileB.profile.dob ? getZodiacSign(profileB.profile.dob) : null;

    const prompt = `Analyze the compatibility between two people based on their palm readings and zodiac signs.

Person A (${profileA.profile.name}):
${signA ? `Zodiac: ${signA}` : 'Zodiac: Unknown'}
Palm Analysis: ${JSON.stringify(profileA.analysis)}

Person B (${profileB.profile.name}):
${signB ? `Zodiac: ${signB}` : 'Zodiac: Unknown'}
Palm Analysis: ${JSON.stringify(profileB.analysis)}

Generate a comprehensive compatibility analysis. Return ONLY valid JSON with this structure:
{
  "overallScore": 85,
  "summary": "Overall compatibility summary",
  "strengths": ["strength1", "strength2", "strength3"],
  "challenges": ["challenge1", "challenge2"],
  "advice": "Relationship advice based on the analysis",
  "categories": {
    "communication": { "score": 80, "description": "How well they communicate" },
    "emotional": { "score": 90, "description": "Emotional compatibility" },
    "lifestyle": { "score": 75, "description": "Lifestyle compatibility" },
    "goals": { "score": 85, "description": "Goal alignment" }
  }${signA && signB ? `,
  "zodiacCompatibility": {
    "signA": "${signA}",
    "signB": "${signB}",
    "description": "Zodiac compatibility analysis"
  }` : ''}
}

Focus on:
- Personality traits compatibility
- Career and life path alignment  
- Communication styles
- Emotional needs and expressions
- Potential areas of conflict and harmony
- Practical relationship advice`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1200
    });

    const compatibility = JSON.parse(response.choices[0].message.content || "{}");
    
    // Add profile metadata
    return {
      ...compatibility,
      profileA: {
        name: profileA.profile.name,
        emoji: profileA.profile.avatarEmoji || undefined,
      },
      profileB: {
        name: profileB.profile.name,
        emoji: profileB.profile.avatarEmoji || undefined,
      },
    };
  } catch (error) {
    console.error("Compatibility generation error:", error);
    throw new Error("Failed to generate compatibility reading");
  }
}
