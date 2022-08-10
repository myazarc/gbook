import { BookmarkModel } from "../models/bookmark.model";
import { GenericRepository } from "./generic.repository";
import { IBookmarkRepository } from "./interfaces/ibookmark.repository";

export class BookmarkRepository extends GenericRepository<BookmarkModel> implements IBookmarkRepository {
  constructor() {
    super(BookmarkModel);
  }
}
