import type { PaymentMethod } from "@/types";

export function calculateShippingEstimate(input: {
  subtotal: number;
  itemCount: number;
  postalCode: string;
  paymentMethod: PaymentMethod;
}) {
  const isMetro = /^(11|12|40|50|56|60|70)/.test(input.postalCode);
  const handlingFee = input.itemCount > 3 ? 120 : 60;
  const distanceFee = isMetro ? 55 : 120;
  const codFee = input.paymentMethod === "cod" ? 45 : 0;
  const shipping = input.subtotal >= 2500 ? 0 : handlingFee + distanceFee + codFee;
  const tax = Number((input.subtotal * 0.18).toFixed(2));

  return {
    shipping,
    tax,
    total: Number((input.subtotal + shipping + tax).toFixed(2))
  };
}
