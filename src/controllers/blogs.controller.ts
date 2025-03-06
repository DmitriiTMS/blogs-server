import { Request, Response } from "express";
import { blogsRepository } from "../repository/blogsRepository";
import { SETTINGS } from "../settings/settings";

export const blogsController = {
  getAllBlogs(req: Request, res: Response) {
    const blogs = blogsRepository.getAll();
    res.status(SETTINGS.HTTP_STATUS.OK).json(blogs);
  },

  createBlog(req: Request, res: Response) {
    const newBlog = blogsRepository.createBlog(req.body);
    res.status(SETTINGS.HTTP_STATUS.GREATED).json(newBlog);
  },

  getBlogById(req: Request, res: Response) {
    const { id } = req.params;
    const blog = blogsRepository.getBlog(id);
    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.status(SETTINGS.HTTP_STATUS.OK).json(blog);
  },

  updateBlog(req: Request, res: Response) {
    const { id } = req.params;
    const blog = blogsRepository.updateBlog(id, req.body);

    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
  },

  deleteBlog(req: Request, res: Response) {
    const { id } = req.params;
    const blog = blogsRepository.getBlog(id);
    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    } else {
      blogsRepository.deleteBlog(id);
      res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
      return;
    }
  },
};
