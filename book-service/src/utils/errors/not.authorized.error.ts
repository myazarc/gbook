import { AppError } from "./app.error";

export class NotAuthorizedError extends AppError {
  constructor(message: string = "Not authorized") {
    super(401, message);
  }
}
