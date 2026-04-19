import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
// --

const router: Router = Router();

// --
router.route("/signup").post(registerUser);
router.route("/verify-email").post(verifyEmail);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

router.route("/change-password").post(isAuthenticated, changePassword);

router.route("/me").get(isAuthenticated, getCurrentUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export { router };
