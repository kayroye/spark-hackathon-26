import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink } from '@/lib/auth/magic-link';

// Simple ID generator for demo
function generateId(): string {
  return `patient_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const result = verifyMagicLink(token);

    if (!result) {
      return NextResponse.json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }

    // Create a user object from the verified token
    const user = {
      id: generateId(),
      email: result.email,
      name: result.name,
      role: 'patient' as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Magic link verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
