import { sendEmail } from "@/lib/mail";
import StockAlert from "@/models/StockAlert";

export async function notifyRestockSubscribers(input: {
  productId: string;
  productName: string;
  productUrl: string;
}) {
  const alerts = await StockAlert.find({
    productId: input.productId,
    notified: false
  });

  if (!alerts.length) {
    return;
  }

  await Promise.all(
    alerts.map((alert) =>
      sendEmail({
        to: alert.email,
        subject: `${input.productName} is back in stock`,
        html: `
          <p>The project you requested is back in stock.</p>
          <p><strong>${input.productName}</strong></p>
          <p><a href="${input.productUrl}">View product</a></p>
        `
      })
    )
  );

  await StockAlert.updateMany(
    {
      productId: input.productId,
      notified: false
    },
    {
      notified: true
    }
  );
}
