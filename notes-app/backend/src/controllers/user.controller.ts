import type { Response, Request, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ResponseHandler } from "../utils/res_handler.js";
import { ErrorHandler } from "../utils/err_handler.js";
import { User } from "../models/user.model.js";
import { mailHelper } from "../utils/mail.utils.js";
import { z } from "zod";
import crypto from "crypto";
// --

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const verifyEmailSchema = z.object({
  otp: z.string().length(6),
  email: z.string().email(),
});

// Helper to generate cookies options
const cookieOptions = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "strict" as const,
};

const registerUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = signupSchema.parse(req.body);

    const existedUser = await User.findOne({
      $or: [
        { username: validatedData.username },
        { email: validatedData.email },
      ],
    });

    if (existedUser) {
      throw new ErrorHandler(409, "User with email or username already exists");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      passwordHash: validatedData.password, // hashed in pre-save hook
      verificationToken: otp,
      verificationTokenExpiry: otpExpiry,
    });

    await mailHelper.sendVerificationEmail(user.email, otp);

    res
      .status(201)
      .json(
        new ResponseHandler(
          201,
          { _id: user._id, username: user.username, email: user.email },
          "User registered! Please check your email for verification code.",
        ),
      );
  },
);

const verifyEmail: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = verifyEmailSchema.parse(req.body);

    const user = await User.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new ErrorHandler(400, "Invalid or expired verification code");
    }

    user.isVerified = true;
    user.verificationToken = "";
    user.verificationTokenExpiry = undefined;

    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ResponseHandler(
          200,
          { _id: user._id, username: user.username, email: user.email },
          "Email verified successfully!",
        ),
      );
  },
);

const loginUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ username });

    if (!user) {
      throw new ErrorHandler(404, "User does not exist");
    }

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.verificationToken = otp;
      user.verificationTokenExpiry = otpExpiry;
      await user.save();

      await mailHelper.sendVerificationEmail(user.email, otp);

      return res
        .status(403)
        .json(
          new ResponseHandler(
            403,
            { _id: user._id, username: user.username, email: user.email },
            "Please verify your email first. A new verification code has been sent.",
          ),
        );
    }

    const isPasswordValid = await (user as any).isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ErrorHandler(401, "Invalid user credentials");
    }

    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ResponseHandler(
          200,
          { _id: user._id, username: user.username, email: user.email },
          "User logged in successfully!",
        ),
      );
  },
);

const logoutUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: { refreshToken: undefined },
      });
    }

    res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ResponseHandler(200, {}, "User logged out!"));
  },
);

const forgotPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email?.trim()) {
      throw new ErrorHandler(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorHandler(404, "User does not exist");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetLink = `${process.env["FRONTEND_URL"]}/reset-password/${resetToken}`;

    await mailHelper.sendResetPasswordEmail(user.email, resetLink);

    res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          {},
          "Forgot password email sent successfully!",
        ),
      );
  },
);

const resetPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      throw new ErrorHandler(400, "Reset token is missing");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new ErrorHandler(400, "Invalid or expired reset token");
    }

    user.passwordHash = password; // hashed in pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json(new ResponseHandler(200, {}, "Password reset successfully!"));
  },
);

const changePassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword?.trim() || !newPassword?.trim()) {
      throw new ErrorHandler(400, "Old and new password are required");
    }

    const user = await User.findById((req as any).user?._id);

    if (!user) {
      throw new ErrorHandler(404, "User does not exist");
    }

    const isPasswordValid = await (user as any).isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
      throw new ErrorHandler(401, "Invalid user credentials");
    }

    user.passwordHash = newPassword;
    await user.save();

    res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { _id: user._id, username: user.username, email: user.email },
          "Password changed successfully!",
        ),
      );
  },
);

const getCurrentUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { _id: user._id, username: user.username, email: user.email },
          "Current user fetched successfully!",
        ),
      );
  },
);

const getUserById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ErrorHandler(404, "User does not exist");
    }

    res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { _id: user._id, username: user.username, email: user.email },
          "User fetched successfully!",
        ),
      );
  },
);

const updateUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!username?.trim()) {
      throw new ErrorHandler(400, "Username is required");
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { username } },
      { new: true },
    );

    if (!user) {
      throw new ErrorHandler(404, "User does not exist");
    }

    res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { _id: user._id, username: user.username, email: user.email },
          "User updated successfully!",
        ),
      );
  },
);

const deleteUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ErrorHandler(404, "User does not exist");
    }

    // user's associated notes also delete

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json(new ResponseHandler(200, {}, "User deleted successfully!"));
  },
);

export {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
};
