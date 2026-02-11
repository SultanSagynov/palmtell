export type Plan = "pro" | "ultimate";
export type AccessTier = "trial" | "expired" | "pro" | "ultimate";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";
export type ReadingStatus = "pending" | "processing" | "completed" | "failed";

export interface PalmAnalysis {
  personality: {
    summary: string;
    traits: string[];
  };
  life_path: {
    summary: string;
    lines: {
      life: string;
      head: string;
      heart: string;
    };
  };
  career: {
    summary: string;
    fields: string[];
    strengths: string[];
  };
  relationships: {
    summary: string;
  };
  health: {
    summary: string;
  };
  lucky: {
    numbers: number[];
    symbol: string;
  };
}

export interface ReadingSection {
  key: string;
  title: string;
  icon: string;
  freeAccess: boolean;
  proAccess: boolean;
  ultimateAccess: boolean;
}

export const READING_SECTIONS: ReadingSection[] = [
  { key: "personality", title: "Personality", icon: "User", freeAccess: true, proAccess: true, ultimateAccess: true },
  { key: "life_path", title: "Life Path", icon: "Compass", freeAccess: true, proAccess: true, ultimateAccess: true },
  { key: "career", title: "Career", icon: "Briefcase", freeAccess: true, proAccess: true, ultimateAccess: true },
  { key: "relationships", title: "Relationships", icon: "Heart", freeAccess: false, proAccess: true, ultimateAccess: true },
  { key: "health", title: "Health", icon: "Activity", freeAccess: false, proAccess: true, ultimateAccess: true },
  { key: "lucky", title: "Lucky Numbers", icon: "Star", freeAccess: false, proAccess: true, ultimateAccess: true },
];
