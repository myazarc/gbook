import { UserRepository } from "../database/repository/user.repository";
import { UserRegisterDto } from "../dto/user/user.register.dto";
import { FieldExistError } from "../utils/errors/field.exist.error";
import { classToClassFromExist, plainToClass, plainToInstance } from "class-transformer";
import { UserModel } from "../database/models/user.entity";
import { UserLoginDto } from "../dto/user/user.login.dto";
import { NotAuthorizedError } from "../utils/errors/not.authorized.error";
import { comparePassword } from "../utils/pass.hash";

export class UserService {
  protected readonly userRepository: UserRepository = new UserRepository();

  async register(user: UserRegisterDto) {
    const userExists = await this.userRepository.findByEmail(user.email);
    if (userExists) {
      throw new FieldExistError("Email already exists");
    }
    const model = plainToClass(UserModel, user);
    return this.userRepository.create(model);
  }

  async doLogin(user: UserLoginDto): Promise<UserModel> {
    const userResult = await this.userRepository.findByEmail(user.email);
    if (!userResult) {
      throw new NotAuthorizedError();
    }

    if (comparePassword(user.password, userResult.password)) {
      return userResult;
    } else {
      throw new NotAuthorizedError();
    }
  }
}
