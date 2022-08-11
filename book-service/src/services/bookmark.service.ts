import { nextTick } from "process";
import { BookmarkModel } from "../database/models/bookmark.model";
import { BookmarkRepository } from "../database/repository/bookmark.repositoy";
import { BookmarkListDto } from "../dto/book/bookmark.list.dto";
import { BookmarkListResponseDto } from "../dto/book/bookmark.list.response.dto";
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

  async getBookmarks(user: any, bookmarkList: BookmarkListDto): Promise<BookmarkListResponseDto> {
    const pagination = {
      page: 0,
      maxResults: 10,
    };

    if (bookmarkList.page) {
      pagination.page = bookmarkList.page;
    }
    if (bookmarkList.maxResults) {
      pagination.maxResults = bookmarkList.maxResults;
    }

    const offset = (pagination.page - 1) * pagination.maxResults;

    const bookmarks = await this.bookmarkRepository.findByWithPagination(user.userId, offset, pagination.maxResults);
    const totalItems = await this.bookmarkRepository.count(user.userId);

    const response = new BookmarkListResponseDto();
    response.items = bookmarks;
    response.totalItems = totalItems;
    response.currentPage = pagination.page;
    response.maxResults = pagination.maxResults;
    response.pageCount = Math.ceil(totalItems / pagination.maxResults);

    return response;
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
