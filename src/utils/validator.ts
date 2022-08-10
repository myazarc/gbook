import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestError } from "./errors/bad.request.error";

export async function validator(body: any, dto: any): Promise<any> {
  const instance = plainToInstance(dto, body);
  const errors = await validate(instance);
  if (errors.length) {
    const error = errors.map((e) => {
      {
        return {
          property: e.property,
          errors: Object.values(e.constraints as any),
        };
      }
    });
    throw new BadRequestError(JSON.stringify(error));
  }
  return instance;
}
