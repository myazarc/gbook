import { AppError } from "./app.error";

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(404, message);
  }
}
