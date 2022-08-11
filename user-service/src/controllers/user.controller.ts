import { NextFunction, Response, Request } from "express";
import { UserLoginDto } from "../dto/user/user.login.dto";
import { UserRegisterDto } from "../dto/user/user.register.dto";
import { UserService } from "../services/user.service";
import { FieldExistError } from "../utils/errors/field.exist.error";
import { jwtSign } from "../utils/jwt";
import { ResponseService } from "../utils/reponse.service";
import { validator } from "../utils/validator";

export class UserController {
  protected readonly userService: UserService = new UserService();

  register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const response = new ResponseService();
    try {
      const userDto = await validator(req.body, UserRegisterDto);
      const userResult = await this.userService.register(userDto);
      response.setData(null);
      return res.status(200).json(response.getResponse());
    } catch (err) {
      if (err instanceof FieldExistError) {
        response.setError(err.message);
        return res.status(err.statusCode).json(response.getResponse());
      } else {
        next(err);
      }
    }
  };

  doLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const response = new ResponseService();
    try {
      const userDto = await validator(req.body, UserLoginDto);
      const userResult = await this.userService.doLogin(userDto);
      const token = jwtSign(userResult.id, userResult.email);
      response.setData({ access_token: token });
      return res.status(200).json(response.getResponse());
    } catch (err) {
      next(err);
    }
  };
}
