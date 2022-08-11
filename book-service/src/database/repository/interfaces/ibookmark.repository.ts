import { BookmarkModel } from "../../models/bookmark.model";

export interface IBookmarkRepository {
  findByWithPagination(userId: number, offset: number, limit: number): Promise<BookmarkModel[]>;
  count(userId: number): Promise<number>;
}
