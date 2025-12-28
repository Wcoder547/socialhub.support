// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  photo: string;
}

const UserSchema: Schema<User> = new Schema({
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
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
