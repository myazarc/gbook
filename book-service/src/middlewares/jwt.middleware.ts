import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../utils/errors/not.authorized.error";
import { jwtVerify } from "../utils/jwt";

export function auth(req: Request, res: Response, next: NextFunction) {
  if (req.get("Authorization")) {
    if (req.get("Authorization")?.startsWith("Bearer ")) {
      const token = req.get("Authorization")?.split(" ")[1];
      try {
        const result = jwtVerify(token as string);
        if (result) {
          res.locals.user = result;
          return next();
        }
      } catch (err) {
        throw new NotAuthorizedError();
      }
    }
  }
  throw new NotAuthorizedError();
}
