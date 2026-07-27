import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

// Build a reusable transporter using Gmail SMTP + App Password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL on port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return the same response shape for security (don't leak account existence)
    if (!admin) {
      return NextResponse.json({
        success: true,
        message: 'If the email matches an administrator account, a reset link has been sent.',
      });
    }

    // Generate a secure 32-byte random token (64 hex chars)
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.admin.update({
      where: { id: admin.id },
      data: { resetToken, resetTokenExpiry },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/admin/reset-password?token=${resetToken}`;

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"India Sri Lanka Escape Admin" <rohithempire009@gmail.com>',
      to: admin.email,
      subject: '🔑 Reset Your Admin Password — India Sri Lanka Escape',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8" /></head>
        <body style="margin:0;padding:0;background:#FAF8F6;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F6;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2d9;">
                  <!-- Header -->
                  <tr>
                    <td style="background:#1e293b;padding:28px 36px;text-align:center;">
                      <p style="margin:0;color:#ebb337;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Admin CMS</p>
                      <p style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:800;">India Sri Lanka Escape</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:36px;">
                      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">Password Reset Request</p>
                      <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
                        Hi <strong>${admin.email}</strong>,<br/>
                        We received a request to reset your admin password. Click the button below to create a new password. This link expires in <strong>1 hour</strong>.
                      </p>
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding:8px 0 28px;">
                            <a href="${resetLink}"
                               style="display:inline-block;background:#ebb337;color:#0f172a;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;letter-spacing:0.3px;">
                              Reset My Password →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Or copy and paste this link in your browser:</p>
                      <p style="margin:0;font-size:11px;color:#475569;word-break:break-all;background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;">
                        ${resetLink}
                      </p>
                      <hr style="border:none;border-top:1px solid #f1f5f9;margin:28px 0 20px;" />
                      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                        If you didn't request this, you can safely ignore this email. Your password will remain unchanged.<br/>
                        — The India Sri Lanka Escape Team
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;padding:18px 36px;text-align:center;border-top:1px solid #f1f5f9;">
                      <p style="margin:0;font-size:11px;color:#cbd5e1;">© ${new Date().getFullYear()} India Sri Lanka Escape. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'A password reset link has been sent to your email address.',
    });
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
