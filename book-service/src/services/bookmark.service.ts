import { nextTick } from "process";
import { BookmarkModel } from "../database/models/bookmark.model";
import { BookmarkRepository } from "../database/repository/bookmark.repositoy";
import { BookmarkElasticListDto } from "../dto/book/bookmark.elastic.list.dto";
import { BookmarkListDto } from "../dto/book/bookmark.list.dto";
import { BookmarkListResponseDto } from "../dto/book/bookmark.list.response.dto";
import { FieldExistError } from "../utils/errors/field.exist.error";
import { NotFoundError } from "../utils/errors/not.found.error";
import { ElasticSearchService, getElasticSearchService } from "./elasticsearch.service";
import { GBookService } from "./gbook.service";

export class BookmarkService {
  protected readonly bookmarkRepository: BookmarkRepository = new BookmarkRepository();
  protected readonly gBookService: GBookService = new GBookService();

  protected readonly elasticService: ElasticSearchService = getElasticSearchService();

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

      const bookmarkResult = await this.bookmarkRepository.create(bookmark);
      await this.elasticService.addBookmark(bookmarkResult.id, bookmark);
      return bookmarkResult;
    } else {
      throw new NotFoundError("Book id not found, id: " + id);
    }
  }

  async getBookmarks(user: any, bookmarkList: BookmarkListDto): Promise<BookmarkListResponseDto> {
    const pagination = {
      page: 1,
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

  async getBookmarkWithElastic(user: any, bookmarkList: BookmarkElasticListDto) {
    const bookmarks = await this.elasticService.search(user.userId, bookmarkList);
    return bookmarks;
  }

  async removeBookmark(id: string, user: any): Promise<any> {
    const bookmark = await this.bookmarkRepository.findOne({ where: { gBookId: id, userId: user.userId } });
    if (bookmark) {
      await this.elasticService.deleteBookmark(bookmark.id);
      return this.bookmarkRepository.delete(bookmark.id);
    } else {
      throw new NotFoundError("Bookmark not found, id: " + id);
    }
  }

  private async getBook(id: string): Promise<any> {
    return await this.gBookService.getBook(id);
  }
}
