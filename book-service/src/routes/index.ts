import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { BookmarkController } from "../controllers/bookmark.controller";
import { auth } from "../middlewares/jwt.middleware";
import proxy from "express-http-proxy";

const proxyBaseUrl = `http://${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`;

const publicRouter = Router();
const bookController = new BookController();
const bookmarkController = new BookmarkController();

publicRouter.get("/search", bookController.search);
publicRouter.post("/login", proxy(proxyBaseUrl + "/login"));
publicRouter.post("/register", proxy(proxyBaseUrl + "/register"));

const protectedRouter = Router();

protectedRouter.post("/bookmark/:id", auth, bookmarkController.add);
protectedRouter.get("/bookmarks", auth, bookmarkController.getBookmarks);
protectedRouter.delete("/bookmark/:id", auth, bookmarkController.remove);
protectedRouter.get("/bookmarks/elastic", auth, bookmarkController.getBookmarksWithElastic);

export { publicRouter, protectedRouter };
