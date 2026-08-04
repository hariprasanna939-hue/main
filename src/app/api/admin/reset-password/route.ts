import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Find admin by reset token
    const admin = await prisma.admin.findUnique({
      where: { resetToken: token },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token.' },
        { status: 400 }
      );
    }

    // Validate token expiry
    if (admin.resetTokenExpiry && admin.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Reset token has expired.' },
        { status: 400 }
      );
    }

    // Hash the new password and clear the reset token fields
    const newPasswordHash = hashPassword(newPassword);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset password.' },
      { status: 500 }
    );
  }
}
