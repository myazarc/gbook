import { nextTick } from "process";
import { BookmarkModel } from "../database/models/bookmark.model";
import { BookmarkRepository } from "../database/repository/bookmark.repositoy";
import { FieldExistError } from "../utils/errors/field.exist.error";
import { NotFoundError } from "../utils/errors/not.found.error";
import { GBookService } from "./gbook.service";

export class BookmarkService {
  protected readonly bookmarkRepository: BookmarkRepository = new BookmarkRepository();
  protected readonly gBookService: GBookService = new GBookService();

  async addBookmark(id: string, user: any): Promise<any> {
    const gBookData = await this.getBook(id);
    if (gBookData) {
      const isExist = await this.bookmarkRepository.findOne({ where: { gBookId: gBookData.id, userId: user.userId } });
      if (isExist) {
        throw new FieldExistError("Bookmark already exists");
      }
      const bookmark = new BookmarkModel();
      bookmark.userId = user.userId;
      bookmark.gBookId = gBookData.id;
      bookmark.title = gBookData.volumeInfo.title;
      bookmark.description = gBookData.volumeInfo?.description;
      bookmark.author = gBookData.volumeInfo.authors.join(", ");
      bookmark.publisher = gBookData.volumeInfo.publisher;
      bookmark.isbn = gBookData.volumeInfo.industryIdentifiers[0].identifier;

      return this.bookmarkRepository.create(bookmark);
    } else {
      throw new NotFoundError("Book id not found, id: " + id);
    }
  }

  async getBookmarks(user: any): Promise<any> {
    return this.bookmarkRepository.findAll({ where: { userId: user.userId } });
  }

  async removeBookmark(id: string, user: any): Promise<any> {
    const bookmark = await this.bookmarkRepository.findOne({ where: { gBookId: id, userId: user.userId } });
    if (bookmark) {
      return this.bookmarkRepository.delete(bookmark.id);
    } else {
      throw new NotFoundError("Bookmark not found, id: " + id);
    }
  }

  private async getBook(id: string): Promise<any> {
    return await this.gBookService.getBook(id);
  }
}
