import { NextFunction, Request, Response } from "express";
import { BookmarkService } from "../services/bookmark.service";
import { ResponseService } from "../utils/reponse.service";

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
      const bookmarks = await this.bookmarkService.getBookmarks(res.locals.user);
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
