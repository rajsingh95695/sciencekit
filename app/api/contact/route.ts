import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { sendEmail } from "@/lib/mail";
import { contactSchema } from "@/lib/validators";
import ContactMessage from "@/models/ContactMessage";

export const GET = withApiHandler(
  async () => {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    return apiSuccess(messages);
  },
  {
    auth: "admin",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = contactSchema.parse(await parseJson(request));
    const message = await ContactMessage.create(payload);

    await sendEmail({
      to: payload.email,
      subject: "We received your message",
      html: `<p>Hi ${payload.name},</p><p>Thanks for contacting ScienceKit. We received your requirement and our team will get back to you shortly.</p>`
    });

    return apiSuccess(message, { status: 201 });
  },
  {
    auth: "public",
    rateLimit: {
      bucket: "contact-form",
      limit: 12,
      windowMs: 60_000
    }
  }
);
