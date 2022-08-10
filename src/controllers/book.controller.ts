import { NextFunction, Response, Request } from "express";
import { BookSearchDto } from "../dto/book/book.search.dto";
import { BookService } from "../services/book.service";
import { BadRequestError } from "../utils/errors/bad.request.error";
import { ResponseService } from "../utils/reponse.service";
import { validator } from "../utils/validator";

export class BookController {
  protected readonly bookService: BookService = new BookService();

  search = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const response = new ResponseService();
    try {
      const avaibleSearchFields = ["title", "author", "publisher", "subject", "isbn", "keywords"];
      if (Object.keys(req?.query).length > 0) {
        const searchFields = Object.keys(req.query);
        const invalidFields = searchFields.filter((field) => avaibleSearchFields.includes(field));
        if (invalidFields.length === 0) {
          throw new BadRequestError("Invalid search fields: Avaible fields are: " + avaibleSearchFields.join(", "));
        }
      } else {
        throw new BadRequestError("Invalid search fields: Avaible fields are: " + avaibleSearchFields.join(", "));
      }

      const searchDto = await validator(req.query, BookSearchDto);
      const booksResult = await this.bookService.getBooks(searchDto);
      if (booksResult.totalItems > 0) {
        response.setData(booksResult);
      } else {
        response.setError("No books found");
      }
      return res.status(200).json(response.getResponse());
    } catch (err) {
      next(err);
    }
  };
}
