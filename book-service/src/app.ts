import express from "express";
import { errorResponder } from "./middlewares/error.responder";
import { protectedRouter, publicRouter } from "./routes";
export class ExpressApp {
  app = express();

  constructor() {
    this.setSettings();
    this.setRoutes();
  }

  setSettings() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setRoutes() {
    this.app.use("/", publicRouter, protectedRouter);
    this.app.use(errorResponder);
  }
}
