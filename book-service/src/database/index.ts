import { BookmarkModel } from "./models/bookmark.model";
import sequelize from "./sequelize";

sequelize.addModels([BookmarkModel]);

export default sequelize;
