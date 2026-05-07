import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AddressSchema = new Schema(
  {
    label: String,
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    line1: {
      type: String,
      required: true
    },
    line2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: "India"
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: true
  }
);

const CartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  {
    _id: true
  }
);

const RefreshTokenSchema = new Schema(
  {
    tokenHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      required: function (this: UserDocument) {
        return this.provider === "local";
      }
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      sparse: true
    },
    profileImage: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    addresses: {
      type: [AddressSchema],
      default: []
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    cart: {
      type: [CartItemSchema],
      default: []
    },
    saveForLater: {
      type: [CartItemSchema],
      default: []
    },
    refreshTokens: {
      type: [RefreshTokenSchema],
      default: []
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true
  }
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
