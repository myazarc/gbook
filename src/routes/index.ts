import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { auth } from "../middlewares/jwt.middleware";

const publicRouter = Router();
const userController = new UserController();

publicRouter.post("/register", userController.register);
publicRouter.post("/login", userController.doLogin);

const protectedRouter = Router();

protectedRouter.use(auth);

export { publicRouter, protectedRouter };
