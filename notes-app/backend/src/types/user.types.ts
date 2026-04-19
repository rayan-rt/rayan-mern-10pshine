import { type Document } from "mongoose";
// --

interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  refreshToken?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { type IUser };
