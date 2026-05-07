import process from "node:process";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const args = process.argv.slice(2);
const getArg = (flag, fallback = "") => {
  const index = args.findIndex((item) => item === flag);
  return index >= 0 ? args[index + 1] || fallback : fallback;
};

const email = getArg("--email", "admin@sciencekit.in");
const password = getArg("--password", "ChangeMe123");
const name = getArg("--name", "ScienceKit Admin");

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed the admin user.");
}

await mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true
    },
    phone: String,
    password: String,
    role: String
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

await User.findOneAndUpdate(
  { email },
  {
    name,
    email,
    phone: "",
    password: await bcrypt.hash(password, 12),
    role: "admin"
  },
  {
    upsert: true,
    returnDocument: "after"
  }
);

console.log(`Admin ready: ${email}`);
await mongoose.disconnect();
