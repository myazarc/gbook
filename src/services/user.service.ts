import { UserRepository } from "../database/repository/user.repository";
import { UserRegisterDto } from "../dto/user/user.register.dto";
import { FieldExistError } from "../utils/errors/field.exist.error";
import { classToClassFromExist, plainToClass, plainToInstance } from "class-transformer";
import { UserModel } from "../database/models/user.entity";

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
}
