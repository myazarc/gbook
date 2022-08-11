import axios from "axios";
import { encode } from "urlencode";

export class GBookService {
  private readonly G_BOOK_URL = "https://www.googleapis.com/books/v1/volumes";

  async getBooks(query: string, pagination: any): Promise<any> {
    const url = `${this.G_BOOK_URL}?q=${encode(query)}&startIndex=${pagination.startIndex}&maxResults=${pagination.maxResults}`;
    const response = await axios.get(url);
    return response.data;
  }

  async getBook(id: string): Promise<any> {
    const url = `${this.G_BOOK_URL}/${id}`;
    const response = await axios.get(url);
    return response.data;
  }
}
