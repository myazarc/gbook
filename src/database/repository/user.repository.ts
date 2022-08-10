import { UserModel } from "../models/user.entity";
import { GenericRepository } from "./generic.repository";
import { IUserRepository } from "./interfaces/iuser.repository";

export class UserRepository extends GenericRepository<UserModel> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  findByEmail(email: string): Promise<UserModel | null> {
    return this.findOne({ where: { email } });
  }
}
