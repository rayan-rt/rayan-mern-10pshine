import { type NextFunction, type Request, type Response } from "express";
import { ErrorHandler } from "../utils/err_handler.js";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user.model.js";
import type { IUser } from "../types/user.types.js";
// --

async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let accessToken =
    req.cookies["accessToken"] ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    // return next(new ErrorHandler("Unauthorized Request", 401));
    return res.status(401).json({ message: "Unauthorized Request" });
  }

  let payload: Partial<IUser> = jsonwebtoken.verify(
    accessToken,
    process.env["ACCESS_TOKEN_SECRET"] as string,
  ) as Partial<IUser>;

  let signedInUser = await User.findById(payload._id).select(
    "-password -accessToken",
  );
  if (!signedInUser) {
    return next(new ErrorHandler(401, "Unauthorized Request"));
  }

  (req as any).user = signedInUser;

  next();
}

// export
export { isAuthenticated };
