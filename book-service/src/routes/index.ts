import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { BookmarkController } from "../controllers/bookmark.controller";
import { auth } from "../middlewares/jwt.middleware";

const publicRouter = Router();
const bookController = new BookController();
const bookmarkController = new BookmarkController();

publicRouter.get("/search", bookController.search);

const protectedRouter = Router();

protectedRouter.use(auth);
protectedRouter.post("/bookmark/add/:id", bookmarkController.add);

export { publicRouter, protectedRouter };
