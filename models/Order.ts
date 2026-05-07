import mongoose, { Schema, type InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String
  },
  {
    _id: false
  }
);

const AddressSchema = new Schema(
  {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  {
    _id: false
  }
);

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      required: true
    },
    shippingAmount: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cashfree", "cod"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    paymentId: String,
    paymentOrderId: String,
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    shippingTrackingId: {
      type: String,
      unique: true,
      sparse: true
    },
    address: {
      type: AddressSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type OrderDocument = InferSchemaType<typeof OrderSchema>;

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
