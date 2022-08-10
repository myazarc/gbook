import { AppError } from "./app.error";

export class FieldExistError extends AppError {
  constructor(message: string = "Field exist") {
    super(409, message);
  }
}
