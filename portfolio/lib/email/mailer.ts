import 'server-only';
import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error(
      'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in your environment.'
    );
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const transporter = createTransporter();

  await transporter.sendMail({
    from,
    to,
    subject: 'Password Reset Request',
    text: [
      'You requested a password reset for your portfolio admin account.',
      '',
      `Reset link (expires in 1 hour): ${resetUrl}`,
      '',
      "If you didn't request this, you can safely ignore this email.",
    ].join('\n'),
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px;background:#0a0a0f;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#2563eb);display:inline-flex;align-items:center;justify-content:center;">
            <span style="color:white;font-weight:700;font-size:20px;">A</span>
          </div>
        </div>
        <h2 style="color:#f9fafb;margin:0 0 12px;font-size:18px;">Password Reset</h2>
        <p style="color:#9ca3af;margin:0 0 24px;font-size:14px;line-height:1.6;">
          You requested a password reset for your portfolio admin account.
          Click the button below — this link expires in <strong style="color:#e5e7eb;">1 hour</strong>.
        </p>
        <a href="${resetUrl}"
           style="display:block;text-align:center;background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;margin-bottom:20px;">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:12px;margin:0;">
          Or copy: <span style="color:#a78bfa;word-break:break-all;">${resetUrl}</span>
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:20px 0;">
        <p style="color:#4b5563;font-size:12px;margin:0;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
