import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const publicRouter = Router();
const userController = new UserController();

publicRouter.post("/register", userController.register);
publicRouter.post("/login", userController.doLogin);

export { publicRouter };
