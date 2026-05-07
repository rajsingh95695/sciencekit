import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type InvoiceInput = {
  orderId: string;
  createdAt: string | Date;
  customerName: string;
  customerEmail: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export async function generateInvoicePdf(input: InvoiceInput) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("ScienceKit Invoice", {
    x: 50,
    y: 790,
    size: 20,
    font: bold,
    color: rgb(0.04, 0.11, 0.2)
  });

  const infoLines = [
    `Order ID: ${input.orderId}`,
    `Date: ${new Date(input.createdAt).toLocaleDateString("en-IN")}`,
    `Customer: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Address: ${input.address}`
  ];

  let cursorY = 760;
  infoLines.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y: cursorY,
      size: 11,
      font
    });
    cursorY -= 18;
  });

  cursorY -= 12;
  page.drawText("Items", {
    x: 50,
    y: cursorY,
    size: 14,
    font: bold
  });
  cursorY -= 24;

  input.items.forEach((item) => {
    page.drawText(`${item.name} x ${item.quantity}`, {
      x: 50,
      y: cursorY,
      size: 11,
      font
    });
    page.drawText(`INR ${(item.price * item.quantity).toFixed(2)}`, {
      x: 430,
      y: cursorY,
      size: 11,
      font
    });
    cursorY -= 18;
  });

  cursorY -= 24;
  [
    `Subtotal: INR ${input.subtotal.toFixed(2)}`,
    `Shipping: INR ${input.shipping.toFixed(2)}`,
    `Tax: INR ${input.tax.toFixed(2)}`,
    `Total: INR ${input.total.toFixed(2)}`
  ].forEach((line, index) => {
    page.drawText(line, {
      x: 340,
      y: cursorY - index * 18,
      size: 12,
      font: index === 3 ? bold : font
    });
  });

  return pdfDoc.save();
}
