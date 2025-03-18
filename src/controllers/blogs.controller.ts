import { Request, Response } from "express";
import { blogsRepository } from "../repository/blogsRepository";
import { SETTINGS } from "../settings/settings";
import { ObjectId } from "mongodb";
import { blogsServices } from "../services/blogs.service";
import {
  BlogReqQueryFilters,
  BlogReqQueryFiltersPage,
} from "../types/blog-types";

export const blogsController = {
  async getAllBlogs(req: Request, res: Response) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query;
    const filters: BlogReqQueryFilters = {
      searchNameTerm: String(searchNameTerm),
      sortBy: String(sortBy),
      sortDirection: String(sortDirection),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const blogsItems = await blogsServices.getAll(filters);
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
    const id = new ObjectId(req.params.blogId);
    const newPost = await blogsServices.createPostWithBlogId(req.body, id);
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

  async getBlogByIdPost(req: Request, res: Response) {
    const { pageNumber, pageSize, sortBy,  sortDirection} = req.query;
    const filters: BlogReqQueryFiltersPage = {
      sortBy: String(sortBy),
      sortDirection: String(sortDirection),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const id = new ObjectId(req.params.blogId);
    const blog = await blogsServices.getOneBlogPost(id, filters);
    if (!blog) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.status(SETTINGS.HTTP_STATUS.OK).json({ ...blog });
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
