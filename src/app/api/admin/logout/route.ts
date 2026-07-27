import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error: any) {
    console.error('Admin logout API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Logout failed.' },
      { status: 500 }
    );
  }
}
