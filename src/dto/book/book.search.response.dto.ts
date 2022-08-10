export class BookSearchResponseDto {
  totalItems: number;
  maxResults: number;
  currentPage: number;
  pageCount: number;
  items: any[];
  fromRedis: boolean;
}
