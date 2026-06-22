import { NextResponse } from 'next/server';
import { sendWeeklyPlanningReminderEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  try {
    console.log(`[TEST ROUTE] Attempting to send Weekly Reminder to ${email}`);
    const res = await sendWeeklyPlanningReminderEmail(email, 'Test User');
    console.log(`[TEST ROUTE] Send result:`, res);

    return NextResponse.json({
      success: res.success,
      details: res
    });
  } catch (error) {
    console.error('[TEST ROUTE] Failure:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
