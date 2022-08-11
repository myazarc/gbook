import { BookmarkModel } from "../models/bookmark.model";
import { GenericRepository } from "./generic.repository";
import { IBookmarkRepository } from "./interfaces/ibookmark.repository";

export class BookmarkRepository extends GenericRepository<BookmarkModel> implements IBookmarkRepository {
  constructor() {
    super(BookmarkModel);
  }

  async findByWithPagination(userId: number, offset: number, limit: number): Promise<BookmarkModel[]> {
    return this.findAll({
      where: { userId },
      offset,
      limit,
    });
  }

  async count(userId: number): Promise<number> {
    return this.model.count({ where: { userId } });
  }
}
