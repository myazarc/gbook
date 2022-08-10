import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/app.error";
import { ResponseService } from "../utils/reponse.service";

export function errorResponder(error: AppError, request: Request, response: Response, next: NextFunction): any {
  response.header("Content-Type", "application/json");
  let data: any;
  try {
    data = JSON.parse(error.message);
  } catch (e) {
    data = error.message;
  }
  console.log(error);
  const responseService = new ResponseService();
  responseService.setError(data);
  const status = error.statusCode || 400;
  response.status(status).json(responseService.getResponse());
}
