import type { NextFunction } from "express";
import { Schema, model } from "mongoose";
import { type IUser } from "../types/user.types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// --

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  { timestamps: true },
);

// Pre-save hook to hash password
userSchema.pre("save", async function (this: IUser, next: NextFunction) {
  if (!this.isModified("passwordHash")) {
    return;
    // return next();
  }

  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  return;
  // return next();
});

// Methods to compare password and generate tokens
userSchema.methods["isPasswordCorrect"] = async function (
  this: IUser,
  password: string,
) {
  return await bcrypt.compare(password, this.passwordHash);
};

userSchema.methods["generateAccessToken"] = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env["ACCESS_TOKEN_SECRET"] as string,
    {
      expiresIn: process.env["ACCESS_TOKEN_EXPIRY"],
    },
  );
};

userSchema.methods["generateRefreshToken"] = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env["REFRESH_TOKEN_SECRET"] as string,
    {
      expiresIn: process.env["REFRESH_TOKEN_EXPIRY"],
    },
  );
};

const User = model<IUser>("User", userSchema);

export { User };
