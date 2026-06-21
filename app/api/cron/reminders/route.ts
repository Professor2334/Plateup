import { NextResponse } from 'next/server';
import { sendWelcomeReminderEmail, sendWeeklyPlanningReminderEmail, sendReEngagementEmail } from '@/lib/resend';

// Vercel Cron Jobs will call this endpoint.
export const maxDuration = 60; // 60 seconds allowed for Hobby, scale appropriately for pro
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Dynamically import db to avoid top-level initialization during build
  const { default: db } = await import('@/lib/db');

  // 1. Authorization Check
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const now = new Date();
  let emailsSent = 0;
  let errors = 0;

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // ── A. Welcome Reminder ─────────────────────────────────────────────
    // Trigger: User verified email, > 24 hours ago, hasn't generated a plan, hasn't received welcome email.
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Find candidates for Welcome email
    const welcomeCandidates = await db.user.findMany({
      where: {
        emailVerified: { lte: twentyFourHoursAgo, not: null }, // Verified more than 24 hours ago
        lastPlanGeneratedAt: null, // Hasn't generated a plan
        emailLogs: {
          none: {
            OR: [
              { type: 'welcome_reminder' }, // Hasn't received this email type
              { createdAt: { gte: startOfToday } } // Prevent duplicate reminders of any type today
            ]
          }
        }
      },
      take: 50 // Process in batches
    });

    for (const user of welcomeCandidates) {
      if (!user.email) continue;
      const res = await sendWelcomeReminderEmail(user.email, user.name);
      await db.emailLog.create({
        data: {
          userId: user.id,
          type: 'welcome_reminder',
          status: res.success ? 'sent' : 'failed'
        }
      });
      if (res.success) emailsSent++;
      else errors++;
    }

    // ── B. Weekly Planning Reminder ─────────────────────────────────────
    // Trigger: Mondays
    // Runs if user opted in to weekly reminders, hasn't generated plan recently (within last 7 days), and hasn't received weekly reminder recently (e.g. within 6 days).
    const isMonday = now.getUTCDay() === 1;

    if (isMonday) {
      const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weeklyCandidates = await db.user.findMany({
        where: {
          receiveWeeklyReminders: true,
          emailVerified: { not: null },
          // Exclude users who recently generated a meal plan
          OR: [
            { lastPlanGeneratedAt: null },
            { lastPlanGeneratedAt: { lt: sevenDaysAgo } }
          ],
          // Must not have received a weekly reminder in the last 6 days, and no reminder today
          emailLogs: {
            none: {
              OR: [
                { type: 'weekly_reminder', createdAt: { gte: sixDaysAgo } },
                { createdAt: { gte: startOfToday } }
              ]
            }
          }
        },
        take: 50
      });

      for (const user of weeklyCandidates) {
        if (!user.email) continue;
        const res = await sendWeeklyPlanningReminderEmail(user.email, user.name);
        await db.emailLog.create({
          data: {
            userId: user.id,
            type: 'weekly_reminder',
            status: res.success ? 'sent' : 'failed'
          }
        });
        if (res.success) emailsSent++;
        else errors++;
      }
    }

    // ── C. Re-engagement Email ──────────────────────────────────────────
    // Trigger: Inactive for 14 days (lastLoginAt or lastPlanGeneratedAt > 14 days ago)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const reEngagementCandidates = await db.user.findMany({
      where: {
        receiveWeeklyReminders: true, // Use same preference bucket for simplicity, or we can use receiveProductUpdates
        emailVerified: { not: null },
        OR: [
          { lastLoginAt: { lte: fourteenDaysAgo } },
          { lastLoginAt: null }
        ],
        AND: [
          {
            OR: [
              { lastPlanGeneratedAt: { lte: fourteenDaysAgo } },
              { lastPlanGeneratedAt: null }
            ]
          }
        ],
        // Must not have received a re-engagement email in the last 14 days, and no reminder today
        emailLogs: {
          none: {
            OR: [
              { type: 're_engagement', createdAt: { gte: fourteenDaysAgo } },
              { createdAt: { gte: startOfToday } }
            ]
          }
        }
      },
      take: 50
    });

    for (const user of reEngagementCandidates) {
      if (!user.email) continue;
      const res = await sendReEngagementEmail(user.email, user.name);
      await db.emailLog.create({
        data: {
          userId: user.id,
          type: 're_engagement',
          status: res.success ? 'sent' : 'failed'
        }
      });
      if (res.success) emailsSent++;
      else errors++;
    }

    return NextResponse.json({ success: true, emailsSent, errors });
    
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
