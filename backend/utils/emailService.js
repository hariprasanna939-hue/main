import nodemailer from "nodemailer";

/**
 * Sends a secure password reset email.
 * Falls back to console printing if SMTP configuration is not present.
 * 
 * @param {string} email - Destination email address
 * @param {string} resetUrl - Complete reset password URL
 */
export const sendResetEmail = async (email, resetUrl) => {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser || "noreply@shreeandalai.com";

  if (!smtpUser || !smtpPass) {
    console.log("\n=========================================");
    console.log(`📧 PASSWORD RESET LINK FOR: ${email}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log("=========================================\n");
    console.warn("⚠️ SMTP credentials not configured in backend/.env. Reset link printed to console above.");
    return { success: true, printedToConsole: true };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `"SHREE ANDAL AI Support" <${smtpFrom}>`,
    to: email,
    subject: "Reset Password Request - SHREE ANDAL AI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">SHREE ANDAL AI</h2>
        </div>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 25px;">
          <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">Hello,</p>
          <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">We received a request to reset the password for your account associated with <strong>${email}</strong>.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Reset Password</a>
          </div>

          <p style="color: #ef4444; font-size: 13px; font-weight: 500; margin-bottom: 24px;">⚡ This secure password reset link will expire in 30 minutes.</p>
          
          <p style="color: #64748b; font-size: 13px; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 30px;">
            If you did not request a password reset, please disregard this email. Your password will remain completely secure and unchanged.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};
