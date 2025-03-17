import { Request, Response } from "express";
import { blogsRepository } from "../repository/blogsRepository";
import { SETTINGS } from "../settings/settings";
import { ObjectId } from "mongodb";
import { blogsServices } from "../services/blogs.services";

export const blogsController = {
  async getAllBlogs(req: Request, res: Response) {
    const blogsItems = await blogsServices.getAll();
    res.status(SETTINGS.HTTP_STATUS.OK).json(blogsItems);
  },

  async createBlog(req: Request, res: Response) {
    const newBlog = await blogsRepository.createBlog(req.body);
    const { _id, ...resBlog } = newBlog;
    res
      .status(SETTINGS.HTTP_STATUS.GREATED)
      .json({ id: newBlog._id, ...resBlog });
  },

  async createPostWithBlogsId(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const newPost = await blogsServices.createPostWithBlogId(req.body, id)
    if (!newPost) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    const { _id, ...resPost } = newPost;
    res.status(SETTINGS.HTTP_STATUS.GREATED).json({ id: _id, ...resPost });
  },

  async getBlogById(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const blog = await blogsRepository.getBlog(id);
    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    const { _id, ...resBlog } = blog;
    res.status(SETTINGS.HTTP_STATUS.OK).json({ id: blog._id, ...resBlog });
  },

  async updateBlog(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const blog = await blogsRepository.updateBlog(id, req.body);

    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
  },

  async deleteBlog(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const blog = await blogsRepository.getBlog(id);
    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    } else {
      await blogsRepository.deleteBlog(id);
      res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
      return;
    }
  },
};
