import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { UserController } from "../controllers/user.controller";
import { auth } from "../middlewares/jwt.middleware";

const publicRouter = Router();
const userController = new UserController();
const bookController = new BookController();

publicRouter.post("/register", userController.register);
publicRouter.post("/login", userController.doLogin);
publicRouter.get("/search", bookController.search);

const protectedRouter = Router();

protectedRouter.use(auth);

export { publicRouter, protectedRouter };
