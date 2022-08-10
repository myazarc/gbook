import axios from "axios";
import { encode } from "urlencode";

export class GBookService {
  private readonly G_BOOK_URL = "https://www.googleapis.com/books/v1/volumes?q=";

  async getBooks(query: string): Promise<any> {
    const url = this.G_BOOK_URL + encode(query);
    const response = await axios.get(url);
    return response.data;
  }
}
