// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  photo: string;
  coins: number;
  role: "user" | "admin";
  passwordHash?: string | null;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter name"],
    },
    email: {
      type: String,
      unique: [true, "Email already existed"],
      required: [true, "Please Enter email"],
    },
    photo: {
      type: String,
      required: [true, "Please Enter photo"],
    },
    coins: { type: Number, default: 50 }, // start with 50

    // NEW FIELDS
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordHash: {
      type: String,
      default: null, // only set for admin/manual accounts
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
