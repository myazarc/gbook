import { NextFunction, Request, Response, Router } from "express";
import { validator } from "../utils/validator";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
