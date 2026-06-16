import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Calculate the date 20 days ago (as requested by user modification)
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    // Delete unsaved meal plans older than 20 days
    const result = await db.mealPlan.deleteMany({
      where: {
        isSaved: false,
        createdAt: {
          lt: twentyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.count} old unsaved meal plans.`,
      count: result.count,
    });
  } catch (error) {
    console.error('Failed to cleanup old meal plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup old meal plans' },
      { status: 500 }
    );
  }
}
