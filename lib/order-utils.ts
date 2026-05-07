import Coupon from "@/models/Coupon";
import Product from "@/models/Product";
import { calculateShippingEstimate } from "@/lib/shipping";
import { NotFoundError, ValidationError } from "@/lib/errors";
import type { Address, PaymentMethod } from "@/types";

export async function computeOrderPricing(input: {
  items: Array<{ productId: string; quantity: number }>;
  address: Address;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}) {
  const products = await Product.find({
    _id: {
      $in: input.items.map((item) => item.productId)
    }
  });

  if (products.length !== input.items.length) {
    throw new NotFoundError("One or more products are unavailable.");
  }

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const normalizedItems = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    if (product.stock < item.quantity) {
      throw new ValidationError(`${product.name} does not have enough stock.`);
    }

    const unitPrice = product.discountPrice || product.price;

    if (!unitPrice) {
      throw new ValidationError(`${product.name} has no price set. Please contact support or wait for pricing.`);
    }

    return {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: unitPrice,
      quantity: item.quantity,
      image: product.images[0]?.url || ""
    };
  });

  const subtotal = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  let discount = 0;
  let couponCode = "";

  if (input.couponCode) {
    const coupon = await Coupon.findOne({
      code: input.couponCode.toUpperCase(),
      active: true,
      expiryDate: {
        $gt: new Date()
      }
    });

    if (coupon && coupon.usedCount < coupon.usageLimit) {
      discount =
        coupon.discountType === "percentage"
          ? Number(((subtotal * coupon.value) / 100).toFixed(2))
          : coupon.value;
      couponCode = coupon.code;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingEstimate = calculateShippingEstimate({
    subtotal: discountedSubtotal,
    itemCount: normalizedItems.length,
    postalCode: input.address.postalCode,
    paymentMethod: input.paymentMethod
  });

  return {
    items: normalizedItems,
    subtotal: discountedSubtotal,
    discount,
    couponCode,
    taxAmount: shippingEstimate.tax,
    shippingAmount: shippingEstimate.shipping,
    totalAmount: shippingEstimate.total
  };
}
