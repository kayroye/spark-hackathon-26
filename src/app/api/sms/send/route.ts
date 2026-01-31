import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, patientName, appointmentDate, facility } = await request.json();

    if (!to || !patientName || !appointmentDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'AC_placeholder') {
      // Demo mode - just return success without actually sending
      console.log('Demo mode: Would send SMS to', to);
      return NextResponse.json({ success: true, demo: true, messageId: 'demo-' + Date.now() });
    }

    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const message = await client.messages.create({
      body: `Reminder: ${patientName} has a medical appointment at ${facility} on ${formattedDate}. Reply YES to confirm or NO to reschedule.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    return NextResponse.json({ success: true, messageId: message.sid });
  } catch (error) {
    console.error('SMS error:', error);
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}
