import { UserModel } from "../../models/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserModel | null>;
}
