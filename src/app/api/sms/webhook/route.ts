import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = formData.get('Body')?.toString().toUpperCase().trim();
    const from = formData.get('From')?.toString();

    console.log(`SMS received from ${from}: ${body}`);

    let responseMessage = '';
    if (body === 'YES') {
      responseMessage = 'Thank you! Your appointment is confirmed.';
    } else if (body === 'NO') {
      responseMessage = 'We will contact you to reschedule your appointment.';
    } else {
      responseMessage = 'Reply YES to confirm or NO to reschedule your appointment.';
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
