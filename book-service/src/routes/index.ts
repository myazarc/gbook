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
publicRouter.get("/login", proxy(proxyBaseUrl + "/login"));
publicRouter.get("/register", proxy(proxyBaseUrl + "/register"));

const protectedRouter = Router();

protectedRouter.use(auth);
protectedRouter.post("/bookmark/:id", bookmarkController.add);
protectedRouter.get("/bookmarks", bookmarkController.getBookmarks);
protectedRouter.delete("/bookmark/:id", bookmarkController.remove);
protectedRouter.get("/bookmarks/elastic", bookmarkController.getBookmarksWithElastic);

export { publicRouter, protectedRouter };
