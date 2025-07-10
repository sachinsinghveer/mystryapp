import mongoose, { Schema, Document } from "mongoose";

// 1. Define Message interface
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// 2. Message schema with correct keys
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true, 
  },
  createdAt: {
    type: Date,     
    required: true,
    default: Date.now,
  },
});

// 3. Define User interface
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  messages: Message[];
  isVerified: boolean;
  isAcceptingMessage: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
}

// 4. Define User schema
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema], 
});

// 5. Create or reuse model
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
