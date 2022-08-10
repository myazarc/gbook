import axios from "axios";
import { encode } from "urlencode";

export class GBookService {
  private readonly G_BOOK_URL = "https://www.googleapis.com/books/v1/volumes?q=";

  async getBooks(query: string, pagination: any): Promise<any> {
    const url = this.G_BOOK_URL + encode(query) + `&startIndex=${pagination.startIndex}&maxResults=${pagination.maxResults}`;
    const response = await axios.get(url);
    return response.data;
  }
}
