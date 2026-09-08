// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const wrapHtml = (content: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; color: #333;">
    <h2 style="color: #2563eb; margin-top: 0;">CUPC Portal</h2>
    <div style="line-height: 1.6;">${content}</div>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
    <p style="font-size: 12px; color: #666; margin-bottom: 0;">Chittagong University Physics Club</p>
  </div>
`;

export async function sendAdminNotification(adminEmails: string[], userName: string, userEmail: string) {
  await transporter.sendMail({
    to: adminEmails,
    subject: "Action Required: New Registration on CUPC",
    html: wrapHtml(`
      <p>A new user has registered and is waiting for approval.</p>
      <p><strong>Name:</strong> ${userName}<br>
      <strong>Email:</strong> ${userEmail}</p>
      <p>Please review and approve their account in the admin dashboard.</p>
    `),
  });
}

export async function sendApprovalEmail(toEmail: string, userName: string) {
  await transporter.sendMail({
    to: toEmail,
    subject: "Welcome to CUPC: Your Account is Approved",
    html: wrapHtml(`
      <p>Hi ${userName},</p>
      <p>Your account has been successfully approved by an administrator.</p>
      <p>You can now log in to the portal to access the feed, resources, and events.</p>
    `),
  });
}

export async function sendBulkEventEmail(bccEmails: string[], eventTitle: string) {
  await transporter.sendMail({
    to: process.env.GMAIL_USER,
    bcc: bccEmails,
    subject: `New CUPC Event: ${eventTitle}`,
    html: wrapHtml(`
      <p>A new event "<strong>${eventTitle}</strong>" has been scheduled.</p>
      <p>Log in to the CUPC portal to check the venue, date, and other details.</p>
    `),
  });
}