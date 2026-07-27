import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    // Check if an admin already exists in the database
    let admin = await prisma.admin.findFirst();
    const defaultEmail = 'admin@escape.com';
    const defaultPassword = 'admin123';

    if (!admin) {
      const passwordHash = hashPassword(defaultPassword);
      admin = await prisma.admin.create({
        data: {
          email: defaultEmail,
          passwordHash: passwordHash,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account ensured/seeded successfully.',
      email: defaultEmail,
      password: defaultPassword,
    });
  } catch (error: any) {
    console.error('Admin seed API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed admin' },
      { status: 500 }
    );
  }
}
