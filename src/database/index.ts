import { UserModel } from "./models/user.model";
import sequelize from "./sequelize";

sequelize.addModels([UserModel]);

export default sequelize;
