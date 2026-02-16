import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, createTrialExpiryWarningEmail } from "@/lib/email";

export async function POST(req: Request) {
  // Verify this is called from a trusted source (cron job)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find users whose trial expires tomorrow (day 6 of trial)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const users = await db.user.findMany({
      where: {
        trialExpiresAt: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        subscription: null, // Only users without active subscriptions
      },
    });

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const user of users) {
      try {
        const warningEmail = createTrialExpiryWarningEmail(
          user.email,
          user.name || "there"
        );
        const success = await sendEmail(warningEmail);
        
        if (success) {
          emailsSent++;
        } else {
          emailsFailed++;
        }
      } catch (error) {
        console.error(`Failed to send trial warning to ${user.email}:`, error);
        emailsFailed++;
      }
    }

    return NextResponse.json({
      success: true,
      usersFound: users.length,
      emailsSent,
      emailsFailed,
    });
  } catch (error) {
    console.error("Trial expiry warning job error:", error);
    return NextResponse.json(
      { error: "Job failed" },
      { status: 500 }
    );
  }
}
