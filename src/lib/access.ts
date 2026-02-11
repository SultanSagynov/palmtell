import type { AccessTier } from "@/types";

interface UserForAccess {
  trialStartedAt: Date | null;
  trialExpiresAt: Date | null;
}

interface SubscriptionForAccess {
  status: string;
  plan: string;
}

export function getAccessTier(
  user: UserForAccess,
  subscription: SubscriptionForAccess | null
): AccessTier {
  const now = new Date();

  if (subscription?.status === "active") {
    return subscription.plan as AccessTier;
  }

  if (user.trialExpiresAt && now < new Date(user.trialExpiresAt)) {
    return "trial";
  }

  return "expired";
}

export function isSectionAccessible(
  sectionKey: string,
  tier: AccessTier
): boolean {
  const freeSections = ["personality", "life_path", "career"];

  if (tier === "trial" || tier === "pro" || tier === "ultimate") {
    return true;
  }

  // expired: only 3 basic sections
  return freeSections.includes(sectionKey);
}

export function getReadingLimit(tier: AccessTier): number {
  switch (tier) {
    case "trial":
      return 1;
    case "pro":
      return 10;
    case "ultimate":
      return Infinity;
    case "expired":
      return 0;
  }
}

export function getProfileLimit(tier: AccessTier): number {
  switch (tier) {
    case "trial":
    case "expired":
      return 1;
    case "pro":
      return 3;
    case "ultimate":
      return Infinity;
  }
}
