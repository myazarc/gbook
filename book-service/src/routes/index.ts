import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { auth } from "../middlewares/jwt.middleware";

const publicRouter = Router();
const bookController = new BookController();

publicRouter.get("/search", bookController.search);

const protectedRouter = Router();

protectedRouter.use(auth);

export { publicRouter, protectedRouter };
