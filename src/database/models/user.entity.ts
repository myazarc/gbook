import { BeforeCreate, BeforeUpdate, Column, Model, Table } from "sequelize-typescript";
import { hashPassword } from "../../utils/pass.hash";

@Table({ tableName: "users", paranoid: true })
export class UserModel extends Model {
  @Column({
    type: "varchar(255)",
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: "text",
    allowNull: false,
  })
  password: string;

  @BeforeCreate
  @BeforeUpdate
  static hashPassword(instance: UserModel) {
    if (instance.changed("password")) {
      instance.password = hashPassword(instance.password);
    }
  }
}
