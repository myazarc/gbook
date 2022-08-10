import { BookSearchDto } from "../dto/book/book.search.dto";
import { BookSearchResponseDto } from "../dto/book/book.search.response.dto";
import { GBookService } from "./gbook.service";
import { RedisSingletonService } from "./redis.service";
import md5 from "md5";

export class BookService {
  protected readonly gBookService: GBookService = new GBookService();

  async getBooks(searchDto: BookSearchDto): Promise<any> {
    const redisService = await RedisSingletonService();
    const redisKey = this.getRedisKey(searchDto);
    const redisValue = await redisService.get(redisKey);
    if (redisValue !== null) {
      const result = JSON.parse(redisValue);
      result.fromRedis = true;
      return result;
    }

    const pagination = {
      startIndex: 0,
      maxResults: 10,
    };

    if (searchDto.maxResults) {
      pagination.maxResults = searchDto.maxResults;
    }

    if (searchDto.page) {
      pagination.startIndex = (searchDto.page - 1) * pagination.maxResults;
    }

    const searchQuery = this.convertQuery(searchDto);
    const books = await this.gBookService.getBooks(searchQuery, pagination);

    const bookPageResult = new BookSearchResponseDto();
    bookPageResult.totalItems = books.totalItems;
    bookPageResult.maxResults = pagination.maxResults;
    bookPageResult.currentPage = searchDto.page;
    bookPageResult.pageCount = Math.ceil(books.totalItems / pagination.maxResults) + 1;
    bookPageResult.items = books.items;
    bookPageResult.fromRedis = false;

    if (books.items.length > 0) {
      await redisService.set(redisKey, JSON.stringify(bookPageResult), 30);
    }
    return bookPageResult;
  }

  private convertQuery({ keywords, isbn, author, publisher, subject, title }: BookSearchDto): string {
    const result = [];
    if (keywords) {
      result.push(`"${keywords}"`);
    }

    if (isbn) {
      result.push(`isbn:"${isbn}"`);
    }

    if (author) {
      result.push(`inauthor:"${author}"`);
    }

    if (publisher) {
      result.push(`inpublisher:"${publisher}"`);
    }

    if (subject) {
      result.push(`subject:"${subject}"`);
    }

    if (title) {
      result.push(`intitle:"${title}"`);
    }

    return result.join("+");
  }

  private getRedisKey(searchDto: BookSearchDto): string {
    const result = [];
    if (searchDto.keywords) {
      result.push(`keywords:${searchDto.keywords}`);
    }

    if (searchDto.isbn) {
      result.push(`isbn:${searchDto.isbn}`);
    }

    if (searchDto.author) {
      result.push(`author:${searchDto.author}`);
    }
    if (searchDto.publisher) {
      result.push(`publisher:${searchDto.publisher}`);
    }
    if (searchDto.subject) {
      result.push(`subject:${searchDto.subject}`);
    }
    if (searchDto.title) {
      result.push(`title:${searchDto.title}`);
    }

    if (searchDto.maxResults) {
      result.push(`maxResults:${searchDto.maxResults}`);
    }

    if (searchDto.page) {
      result.push(`page:${searchDto.page}`);
    }

    return md5(result.join("_"));
  }
}
