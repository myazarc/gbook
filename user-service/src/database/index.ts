import { UserModel } from "./models/user.entity";
import sequelize from "./sequelize";

sequelize.addModels([UserModel]);

export default sequelize;
