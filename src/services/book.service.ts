import { BookSearchDto } from "../dto/book/book.search.dto";
import { BookSearchResponseDto } from "../dto/book/book.search.response.dto";
import { GBookService } from "./gbook.service";

export class BookService {
  protected readonly gBookService: GBookService = new GBookService();

  async getBooks(searchDto: BookSearchDto): Promise<any> {
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
}
