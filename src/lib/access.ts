export type AccessTier = "trial" | "basic" | "pro" | "ultimate" | "expired";

export function getAccessTier(user: any, subscription: any): AccessTier {
  // Check if user has trial access
  if (user.trialExpiresAt && new Date(user.trialExpiresAt) > new Date() && !subscription) {
    return "trial";
  }
  // Check if user has an active subscription
  if (subscription && subscription.status === "active") {
    return subscription.plan as AccessTier;
  }

  return "expired";
}

export function isSectionAccessible(section: string, tier: AccessTier): boolean {
  const accessMatrix = {
    personality: ["trial", "basic", "pro", "ultimate"],
    life_path: ["trial", "basic", "pro", "ultimate"], 
    career: ["trial", "basic", "pro", "ultimate"],
    relationships: ["pro", "ultimate"],
    health: ["pro", "ultimate"],
    lucky: ["pro", "ultimate"],
  };

  return accessMatrix[section as keyof typeof accessMatrix]?.includes(tier) ?? false;
}

export function getProfileLimit(tier: AccessTier): number {
  const limits = {
    trial: 1,
    basic: 1,
    pro: 3,
    ultimate: Infinity,
    expired: 0,
  };

  return limits[tier];
}

export function getReadingLimit(tier: AccessTier): number {
  const limits = {
    trial: 1,
    basic: 1,
    pro: 5,
    ultimate: Infinity,
    expired: 0,
  };

  return limits[tier];
}

export function canAccessDailyHoroscope(tier: AccessTier): boolean {
  return ["pro", "ultimate"].includes(tier);
}

export function canAccessMonthlyHoroscope(tier: AccessTier): boolean {
  return tier === "ultimate";
}

export function canExportPDF(tier: AccessTier): boolean {
  return tier === "ultimate";
}
