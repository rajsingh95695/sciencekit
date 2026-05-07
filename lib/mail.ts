import nodemailer from "nodemailer";
import { Resend } from "resend";

import { getEmailEnv } from "@/lib/env";

type EmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

function renderEmailShell(title: string, body: string) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:24px;">
      <div style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:18px; padding:32px; border:1px solid #d9e5f0;">
        <h1 style="margin:0 0 16px; color:#071225;">${title}</h1>
        <div style="color:#364150; line-height:1.7;">${body}</div>
        <p style="margin-top:24px; color:#64748b;">ScienceKit</p>
      </div>
    </div>
  `;
}

async function sendWithResend(apiKey: string, input: EmailInput) {
  const resend = new Resend(apiKey);
  return resend.emails.send({
    from: "ScienceKit <noreply@sciencekit.in>",
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });
}

async function sendWithSmtp(connectionString: string, input: EmailInput) {
  const transporter = nodemailer.createTransport(connectionString);
  return transporter.sendMail({
    from: "ScienceKit <noreply@sciencekit.in>",
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });
}

export async function sendEmail(input: EmailInput) {
  const env = getEmailEnv();

  if (env.EMAIL_SERVER.startsWith("resend://")) {
    return sendWithResend(env.EMAIL_SERVER.replace("resend://", ""), input);
  }

  return sendWithSmtp(env.EMAIL_SERVER, input);
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendEmail({
    to: email,
    subject: "Reset your ScienceKit password",
    html: renderEmailShell(
      "Reset your password",
      `<p>We received a request to reset your password.</p>
       <p><a href="${resetUrl}" style="display:inline-block; padding:12px 18px; background:#0a6b75; color:#fff; border-radius:999px; text-decoration:none;">Reset Password</a></p>
       <p>If you did not request this, you can ignore this email.</p>`
    )
  });
}

export async function sendOrderConfirmationEmail(email: string, orderId: string, amount: number) {
  return sendEmail({
    to: email,
    subject: `Order confirmed: ${orderId}`,
    html: renderEmailShell(
      "Order confirmed",
      `<p>Your ScienceKit order has been placed successfully.</p>
       <p><strong>Order ID:</strong> ${orderId}</p>
       <p><strong>Total:</strong> INR ${amount.toFixed(2)}</p>`
    )
  });
}

export async function sendShippingUpdateEmail(
  email: string,
  orderId: string,
  trackingId: string
) {
  return sendEmail({
    to: email,
    subject: `Shipping update for ${orderId}`,
    html: renderEmailShell(
      "Your order is on the way",
      `<p>Your order <strong>${orderId}</strong> has been shipped.</p>
       <p><strong>Tracking ID:</strong> ${trackingId}</p>`
    )
  });
}
