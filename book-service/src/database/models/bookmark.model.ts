import { Model, Table, Column, ForeignKey, Index } from "sequelize-typescript";

@Table({ tableName: "bookmarks", paranoid: true })
export class BookmarkModel extends Model {
  @Column({
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  userId: number;

  @Column({
    type: "varchar(255)",
    allowNull: false,
  })
  @Index
  gBookId: string;

  @Column({
    type: "varchar(255)",
    allowNull: false,
  })
  title: string;

  @Column({
    type: "varchar(255)",
  })
  isbn: string;

  @Column({
    type: "varchar(255)",
  })
  author: string;

  @Column({
    type: "text",
  })
  description: string;

  @Column({
    type: "varchar(255)",
  })
  publisher: string;
}
