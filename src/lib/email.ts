// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ponytail: basic wrappers, add templates when these get too complex
export async function sendAdminNotification(userName: string, userEmail: string) {
  // admin email target: process.env.GMAIL_USER
  await transporter.sendMail({
    to: process.env.GMAIL_USER,
    subject: "New Registration on CUPC",
    html: `<p>New user registered: ${userName} (${userEmail}). Please review in admin dashboard.</p>`,
  });
}

export async function sendApprovalEmail(toEmail: string, userName: string) {
  await transporter.sendMail({
    to: toEmail,
    subject: "Your CUPC Account is Approved",
    html: `<p>Hi ${userName}, your account has been approved. You can now log in.</p>`,
  });
}

export async function sendBulkEventEmail(bccEmails: string[], eventTitle: string) {
  await transporter.sendMail({
    to: process.env.GMAIL_USER, // Self
    bcc: bccEmails,
    subject: `New Event: ${eventTitle}`,
    html: `<p>A new event "<strong>${eventTitle}</strong>" has been posted. Check the website for details!</p>`,
  });
}