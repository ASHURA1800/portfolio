import "server-only";
import nodemailer from "nodemailer";
import type { ContactInput } from '@/lib/validation/schemas';

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/** Send an email notification when a new contact form submission arrives */
export async function sendContactNotification(
  data: ContactInput
): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('[Email] SMTP not configured — skipping notification');
    return;
  }

  const transporter = createTransport();
  const to = process.env.NOTIFICATION_EMAIL ?? process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${process.env.SENDER_NAME ?? 'Portfolio Bot'}" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email,
    subject: `[Portfolio] New message: ${data.subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#fafafa;border-radius:8px;border:1px solid #e2e8f0">
        <h2 style="color:#7c3aed;margin-top:0">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#64748b;width:90px">Name</td><td style="padding:8px 0;font-weight:600">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Subject</td><td style="padding:8px 0">${escapeHtml(data.subject)}</td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#fff;border-radius:6px;border:1px solid #e2e8f0">
          <p style="margin:0;color:#1e293b;white-space:pre-wrap">${escapeHtml(data.message)}</p>
        </div>
        <p style="margin-top:16px;color:#94a3b8;font-size:12px">
          Sent from your portfolio contact form. Reply directly to this email to respond.
        </p>
      </div>
    `,
    text: `New contact form submission\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
  });
}

/** Send an auto-reply acknowledgement to the person who submitted the form */
export async function sendContactAcknowledgement(
  data: Pick<ContactInput, 'name' | 'email'>
): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;

  const transporter = createTransport();

  const senderName = process.env.SENDER_NAME ?? 'Portfolio';
  await transporter.sendMail({
    from: `"${senderName}" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "I've received your message!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#fafafa;border-radius:8px;border:1px solid #e2e8f0">
        <h2 style="color:#7c3aed;margin-top:0">Hey ${escapeHtml(data.name)} 👋</h2>
        <p style="color:#1e293b">Thanks for reaching out! I've received your message and will get back to you within <strong>24 hours</strong>.</p>
        <p style="color:#64748b;font-size:14px">In the meantime, feel free to check out my projects on <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#7c3aed">my portfolio</a>.</p>
        <p style="color:#1e293b;margin-top:24px">Cheers,<br/><strong>${escapeHtml(senderName)}</strong></p>
      </div>
    `,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
