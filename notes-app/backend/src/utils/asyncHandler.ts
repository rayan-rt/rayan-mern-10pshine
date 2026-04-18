import { type NextFunction, type Request, type Response } from "express";
// --

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => any,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
