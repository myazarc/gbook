import { NextFunction, Request, Response } from "express";
import { BookmarkElasticListDto } from "../dto/book/bookmark.elastic.list.dto";
import { BookmarkListDto } from "../dto/book/bookmark.list.dto";
import { BookmarkService } from "../services/bookmark.service";
import { BadRequestError } from "../utils/errors/bad.request.error";
import { ResponseService } from "../utils/reponse.service";
import { validator } from "../utils/validator";

export class BookmarkController {
  protected readonly bookmarkService: BookmarkService = new BookmarkService();

  add = async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseService();
    try {
      const bookmark = await this.bookmarkService.addBookmark(req.params.id, res.locals.user);
      response.setData(bookmark);
      return res.status(201).json(response.getResponse());
    } catch (err) {
      next(err);
    }
  };

  getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseService();
    try {
      const bookmarkList = await validator(req.query, BookmarkListDto);
      const bookmarks = await this.bookmarkService.getBookmarks(res.locals.user, bookmarkList);
      response.setData(bookmarks);
      return res.status(200).json(response.getResponse());
    } catch (err) {
      next(err);
    }
  };

  getBookmarksWithElastic = async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseService();
    try {
      const avaibleSearchFields = ["title", "author", "keywords"];
      if (Object.keys(req?.query).length > 0) {
        const searchFields = Object.keys(req.query);
        const invalidFields = searchFields.filter((field) => avaibleSearchFields.includes(field));
        if (invalidFields.length === 0) {
          throw new BadRequestError("Invalid search fields: Avaible fields are: " + avaibleSearchFields.join(", "));
        }
      } else {
        throw new BadRequestError("Invalid search fields: Avaible fields are: " + avaibleSearchFields.join(", "));
      }
      const bookmarkList = await validator(req.query, BookmarkElasticListDto);
      const bookmarks = await this.bookmarkService.getBookmarkWithElastic(res.locals.user, bookmarkList);
      response.setData(bookmarks);
      return res.status(200).json(response.getResponse());
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseService();
    try {
      const bookmark = await this.bookmarkService.removeBookmark(req.params.id, res.locals.user);
      response.setData(bookmark);
      return res.status(200).json(response.getResponse());
    } catch (err) {
      next(err);
    }
  };
}
