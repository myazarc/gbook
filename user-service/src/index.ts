import DotenvFlow from "dotenv-flow";
DotenvFlow.config({ path: "../envs" });
import "reflect-metadata";
import { ExpressApp } from "./app";
import sequelize from "./database";

export class Server {
  expressApp: ExpressApp;
  constructor() {
    this.expressApp = new ExpressApp();
  }

  run() {
    this.dbStart()
      .then(() => this.appStart())
      .catch((err) => this.serverErrorHandler(err));
  }

  appStart() {
    this.expressApp.app.listen(process.env.USER_SERVICE_PORT || 3000, () => {
      console.log(`Server started on port ${process.env.USER_SERVICE_PORT || 3000}`);
    });
  }

  dbStart() {
    return sequelize.sync();
  }

  serverErrorHandler = (error: Error) => {
    console.log("Server run error: ", error.message);
  };
}

const server = new Server();
server.run();
