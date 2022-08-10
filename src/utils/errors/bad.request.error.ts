import { AppError } from "./app.error";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(400, message);
  }
}
